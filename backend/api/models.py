from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.exceptions import ValidationError
from django.conf import settings
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

# Allowed choices for plan names, currencies, and billing intervals.
PLAN_CHOICES = (
    ('pro', 'Pro'),
    ('premium', 'Premium'),
)

CURRENCY_CHOICES = (
    ('eur', 'EUR'),
    ('usd', 'USD'),
)
DEFAULT_CURRENCY = 'usd'

BILLING_INTERVAL_CHOICES = (
    ('month', 'Monthly'),
    ('year', 'Yearly'),
    ('lifetime', 'Lifetime'),
)

class Plan(models.Model):
    name = models.CharField(max_length=20, choices=PLAN_CHOICES, unique=True)
    description = models.TextField(blank=True, null=False)
    features = models.TextField(blank=True, null=False)
    stripe_product_id = models.CharField(max_length=100, blank=True, null=True)

class Price(models.Model):
    """
    Price for a Plan.
    """
    plan = models.ForeignKey(Plan, related_name="prices", on_delete=models.CASCADE)
    billing_interval = models.CharField(max_length=10, choices=BILLING_INTERVAL_CHOICES)
    unit_amount = models.PositiveIntegerField(help_text="Price in cents")
    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default=DEFAULT_CURRENCY)
    stripe_price_id = models.CharField(max_length=100, blank=True, null=True)
    active = models.BooleanField(default=True)

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, name, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    pricing_plan = models.ForeignKey('Plan', null=True, blank=True, on_delete=models.SET_NULL)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

class UserSubscription(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name="subscription", on_delete=models.CASCADE)
    plan = models.ForeignKey('Plan', null=True, blank=True, on_delete=models.SET_NULL)
    stripe_subscription_id = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, default="inactive")
    current_period_end = models.DateTimeField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def clean(self):
        # Validate that a paid plan requires a valid stripe_subscription_id
        if self.plan and self.plan.name != "free":
            if not self.stripe_subscription_id:
                raise ValidationError("Paid plans require a valid stripe_subscription_id.")
            else:
                # Verify the subscription ID with Stripe
                try:
                    subscription = stripe.Subscription.retrieve(self.stripe_subscription_id)
                    if subscription.status not in ["active", "trialing"]:
                        raise ValidationError("The Stripe subscription is not active.")
                except stripe.error.InvalidRequestError:
                    raise ValidationError("The Stripe subscription ID is invalid.")

    def save(self, *args, **kwargs):
        self.clean()  # Enforce validation before saving
        super().save(*args, **kwargs)