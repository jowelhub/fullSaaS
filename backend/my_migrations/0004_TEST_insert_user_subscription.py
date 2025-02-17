from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_add_predefined_prices'),  # Adjust this to the latest migration in your project
    ]

    operations = [
        migrations.RunSQL(
            """
            INSERT INTO api_usersubscription (user_id, plan_id, stripe_subscription_id, status, current_period_end, created)
            VALUES (2, 1, 'sub_1234567890abcdef', 'active', '2025-12-31 23:59:59', '2025-02-17 00:00:00');
            """
        ),
    ]