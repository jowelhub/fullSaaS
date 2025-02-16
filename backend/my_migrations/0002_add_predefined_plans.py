from django.db import migrations
import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_predefined_plans(apps, schema_editor):
    Plan = apps.get_model('api', 'Plan')
    
    try:
        pro_product = stripe.Product.create(
            name='Pro',
            description='Pro Plan',
            metadata={"plan": 'pro'},
        )
        Plan.objects.create(
            name='pro',
            description='Pro Plan',
            features='Feature 1, Feature 2',
            stripe_product_id=pro_product["id"]
        )
    except Exception as e:
        print(f"Error creating Pro plan: {e}")
        raise

    try:
        premium_product = stripe.Product.create(
            name='Premium',
            description='Premium Plan',
            metadata={"plan": 'premium'},
        )
        Plan.objects.create(
            name='premium',
            description='Premium Plan',
            features='Feature 1, Feature 2, Feature 3',
            stripe_product_id=premium_product["id"]
        )
    except Exception as e:
        print(f"Error creating Premium plan: {e}")
        raise

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_predefined_plans),
    ]