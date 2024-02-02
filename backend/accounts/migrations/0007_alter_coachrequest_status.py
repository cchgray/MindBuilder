# Generated by Django 4.2.4 on 2023-08-21 17:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0006_coachrequest_coachassignment_request"),
    ]

    operations = [
        migrations.AlterField(
            model_name="coachrequest",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending", "Pending"),
                    ("accepted", "Accepted"),
                    ("denied", "Denied"),
                ],
                default="pending",
                max_length=10,
            ),
        ),
    ]
