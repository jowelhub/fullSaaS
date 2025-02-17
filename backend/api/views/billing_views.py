import json
import stripe
import logging
import traceback
import datetime
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from ..models import Price, UserSubscription, Plan, User
from django.views.decorators.csrf import csrf_exempt

stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)

class VerifyCheckoutSessionView(APIView):
    """
    Verify the Stripe Checkout Session ID.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = json.loads(request.body)
            session_id = data.get("session_id")
            if not session_id:
                logger.error("Session ID is required.")
                return Response({"isValid": False}, status=400)

            session = stripe.checkout.Session.retrieve(session_id)
            if session and session["payment_status"] == "paid":
                logger.info(f"Payment verified successfully for session ID: {session_id}")
                return Response({"isValid": True})
            else:
                logger.warning(f"Payment not verified for session ID: {session_id}")
                return Response({"isValid": False}, status=400)
        except stripe.error.InvalidRequestError as e:
            logger.error(f"Invalid request error: {e}")
            return Response({"isValid": False}, status=400)
        except Exception as e:
            logger.error(f"An error occurred: {e}")
            logger.error(traceback.format_exc())
            return Response({"isValid": False}, status=500)

class CreateCheckoutSessionView(APIView):
    """
    Create a Stripe Checkout Session for the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Expect a JSON payload with 'price_id' referring to our local Price pk.
        data = json.loads(request.body)
        price_id = data.get("price_id")
        try:
            price_obj = Price.objects.get(id=price_id, active=True)
        except Price.DoesNotExist:
            logger.error(f"Price with id {price_id} not found.")
            return Response({"error": "Price not found."}, status=404)

        domain_url = settings.FRONTEND_URL
        try:
            checkout_session = stripe.checkout.Session.create(
                customer_email=request.user.email,  # Use user's email as customer ID
                payment_method_types=["card"],
                line_items=[{
                    "price": price_obj.stripe_price_id,
                    "quantity": 1,
                }],
                mode="subscription",
                success_url=domain_url + "/checkout/success/?session_id={CHECKOUT_SESSION_ID}",
                cancel_url=domain_url + "/checkout/cancel/",
                client_reference_id=str(request.user.id),  # Reference to the user ID
                metadata={
                    "user_id": request.user.id,
                    "price_id": price_id,
                },
            )
            logger.info(f"Created Stripe Checkout Session for user {request.user.email}")
            return Response({"sessionId": checkout_session["id"]})
        except Exception as e:
            logger.error(f"Error creating Stripe Checkout Session: {e}")
            return Response({"error": f"Error creating Stripe Checkout Session: {str(e)}"}, status=500)

class StripeWebhookView(View):
    """
    Handle incoming Stripe webhooks.
    When a checkout.session.completed or invoice.payment_succeeded event occurs, update the user's subscription.
    """
    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except (ValueError, stripe.error.SignatureVerificationError) as e:
            logger.error(f"Webhook signature verification failed: {e}")
            return HttpResponse(status=400)

        logger.info(f"Received event: {event['type']}")

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            customer_email = session.get("customer_email")
            stripe_subscription_id = session.get("subscription")
            logger.info(f"Processing checkout.session.completed for {customer_email}")

            # Retrieve line items to find the purchased price.
            line_items = stripe.checkout.Session.list_line_items(session["id"])
            if line_items["data"]:
                stripe_price_id = line_items["data"][0]["price"]["id"]
                try:
                    price_obj = Price.objects.get(stripe_price_id=stripe_price_id)
                except Price.DoesNotExist:
                    price_obj = None
                    logger.error(f"Price with Stripe ID {stripe_price_id} not found.")
            else:
                price_obj = None
                logger.error("No line items found in the session.")

            if customer_email and price_obj:
                try:
                    user = User.objects.get(email=customer_email)
                    logger.info(f"User found: {user.email}")
                    if stripe_subscription_id:
                        # Retrieve the subscription from Stripe to get the current period end
                        stripe_subscription = stripe.Subscription.retrieve(stripe_subscription_id)
                        current_period_end = stripe_subscription["current_period_end"]
                        UserSubscription.objects.update_or_create(
                            user=user,
                            defaults={
                                "plan": price_obj.plan,
                                "stripe_subscription_id": stripe_subscription_id,
                                "status": "active",
                                "current_period_end": datetime.fromtimestamp(current_period_end),
                            }
                        )
                        logger.info(f"Subscription updated for user {user.email}")
                    else:
                        logger.error("Stripe subscription ID is None.")
                except User.DoesNotExist:
                    logger.error(f"User with email {customer_email} not found.")
                except Exception as e:
                    logger.error(f"Error updating subscription for user {customer_email}: {e}")
                    logger.error(traceback.format_exc())  # Log the full traceback

        elif event["type"] == "invoice.payment_succeeded":
            invoice = event["data"]["object"]
            stripe_subscription_id = invoice["subscription"]
            logger.info(f"Processing invoice.payment_succeeded for subscription {stripe_subscription_id}")
            try:
                user_subscription = UserSubscription.objects.get(stripe_subscription_id=stripe_subscription_id)
                stripe_subscription = stripe.Subscription.retrieve(stripe_subscription_id)
                current_period_end = stripe_subscription["current_period_end"]
                user_subscription.current_period_end = datetime.fromtimestamp(current_period_end)
                user_subscription.status = "active"
                user_subscription.save()
                logger.info(f"Subscription updated for subscription ID {stripe_subscription_id}")
            except UserSubscription.DoesNotExist:
                logger.error(f"UserSubscription with Stripe ID {stripe_subscription_id} not found.")
            except Exception as e:
                logger.error(f"Error updating subscription for subscription ID {stripe_subscription_id}: {e}")
                logger.error(traceback.format_exc())  # Log the full traceback

        elif event["type"] == "invoice.payment_failed":
            invoice = event["data"]["object"]
            stripe_subscription_id = invoice["subscription"]
            logger.info(f"Processing invoice.payment_failed for subscription {stripe_subscription_id}")
            try:
                user_subscription = UserSubscription.objects.get(stripe_subscription_id=stripe_subscription_id)
                user_subscription.status = "payment_failed"
                user_subscription.save()
                logger.info(f"Subscription status set to payment_failed for subscription ID {stripe_subscription_id}")
                # Optionally, notify the user about the payment failure
                # You can use Django signals, Celery tasks, or any other method to notify the user
            except UserSubscription.DoesNotExist:
                logger.error(f"UserSubscription with Stripe ID {stripe_subscription_id} not found.")
            except Exception as e:
                logger.error(f"Error updating subscription for subscription ID {stripe_subscription_id}: {e}")
                logger.error(traceback.format_exc())  # Log the full traceback

        elif event["type"] == "customer.subscription.updated":
            subscription = event["data"]["object"]
            stripe_subscription_id = subscription["id"]
            logger.info(f"Processing customer.subscription.updated for subscription {stripe_subscription_id}")
            try:
                user_subscription = UserSubscription.objects.get(stripe_subscription_id=stripe_subscription_id)
                current_period_end = subscription["current_period_end"]
                user_subscription.current_period_end = datetime.fromtimestamp(current_period_end)
                user_subscription.status = subscription["status"]
                user_subscription.save()
                logger.info(f"Subscription updated for subscription ID {stripe_subscription_id}")
            except UserSubscription.DoesNotExist:
                logger.error(f"UserSubscription with Stripe ID {stripe_subscription_id} not found.")
            except Exception as e:
                logger.error(f"Error updating subscription for subscription ID {stripe_subscription_id}: {e}")
                logger.error(traceback.format_exc())  # Log the full traceback

        elif event["type"] == "customer.subscription.deleted":
            subscription = event["data"]["object"]
            stripe_subscription_id = subscription["id"]
            logger.info(f"Processing customer.subscription.deleted for subscription {stripe_subscription_id}")
            try:
                user_subscription = UserSubscription.objects.get(stripe_subscription_id=stripe_subscription_id)
                user_subscription.status = "canceled"
                user_subscription.save()
                logger.info(f"Subscription status set to canceled for subscription ID {stripe_subscription_id}")
            except UserSubscription.DoesNotExist:
                logger.error(f"UserSubscription with Stripe ID {stripe_subscription_id} not found.")
            except Exception as e:
                logger.error(f"Error updating subscription for subscription ID {stripe_subscription_id}: {e}")
                logger.error(traceback.format_exc())  # Log the full traceback

        return HttpResponse(status=200)