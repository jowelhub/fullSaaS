import stripe
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..models import Payment

# @api_view for functions, APIView for classes

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreatePaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            amount = request.data.get('amount')  # Amount in cents
            if amount is None:
                return Response({'error': 'Amount is required.'}, status=status.HTTP_400_BAD_REQUEST)
            amount = int(amount)

            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency='usd',
                automatic_payment_methods={
                    'enabled': True,
                },
            )

            Payment.objects.create(
                user=request.user,
                payment_intent_id=intent.id,
                amount=amount,
            )

            return JsonResponse({
                'clientSecret': intent.client_secret
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HttpResponse(status=400)

    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        payment = Payment.objects.get(payment_intent_id=payment_intent.id)
        payment.status = 'succeeded'
        payment.save()
        print("Payment succeeded")

    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        payment = Payment.objects.get(payment_intent_id=payment_intent.id)
        payment.status = 'failed'
        payment.save()
        print("Payment failed")

    return HttpResponse(status=200)