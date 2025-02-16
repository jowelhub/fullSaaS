from django.db import migrations
import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_predefined_prices(apps, schema_editor):
    Plan = apps.get_model('api', 'Plan')
    Price = apps.get_model('api', 'Price')

    try:
        pro_plan = Plan.objects.get(name='pro')
        pro_monthly_price = stripe.Price.create(
            unit_amount=1000,  # $10.00
            currency='usd',
            recurring={"interval": "month"},
            product=pro_plan.stripe_product_id,
        )
        Price.objects.create(
            plan=pro_plan,
            billing_interval='month',
            unit_amount=1000,
            currency='usd',
            stripe_price_id=pro_monthly_price["id"],
            active=True
        )
    except Exception as e:
        print(f"Error creating Pro monthly price: {e}")
        raise

    try:
        premium_plan = Plan.objects.get(name='premium')
        premium_monthly_price = stripe.Price.create(
            unit_amount=2000,  # $20.00
            currency='usd',
            recurring={"interval": "month"},
            product=premium_plan.stripe_product_id,
        )
        Price.objects.create(
            plan=premium_plan,
            billing_interval='month',
            unit_amount=2000,
            currency='usd',
            stripe_price_id=premium_monthly_price["id"],
            active=True
        )
    except Exception as e:
        print(f"Error creating Premium monthly price: {e}")
        raise

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_add_predefined_plans'),
    ]

    operations = [
        migrations.RunPython(create_predefined_prices),
    ]