from django.urls import path
from ..views.billing_views import PlanListView, SubscriptionDetailView, CreateCheckoutSessionView, StripeWebhookView

urlpatterns = [
    path("plans/", PlanListView.as_view(), name="plan-list"),
    path("subscription/", SubscriptionDetailView.as_view(), name="subscription-detail"),
    path("checkout/", CreateCheckoutSessionView.as_view(), name="create-checkout-session"),
    path("webhook/", StripeWebhookView.as_view(), name="stripe-webhook"),
]