from rest_framework import serializers
from .models import Plan, Price, UserSubscription, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'pricing_plan']

class PriceSerializer(serializers.ModelSerializer):
    billing_interval_display = serializers.CharField(source="get_billing_interval_display", read_only=True)
    
    class Meta:
        model = Price
        fields = ("id", "billing_interval", "billing_interval_display", "unit_amount", "currency", "stripe_price_id", "active")

class PlanSerializer(serializers.ModelSerializer):
    prices = PriceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Plan
        fields = ("id", "name", "description", "features", "stripe_product_id", "prices")

class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)
    
    class Meta:
        model = UserSubscription
        fields = ("plan", "stripe_subscription_id", "status", "current_period_end")
