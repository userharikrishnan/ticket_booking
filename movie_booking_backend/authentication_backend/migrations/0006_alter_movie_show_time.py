# Generated by Django 5.0.3 on 2024-05-07 04:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication_backend', '0005_bookingregister_moviename'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='Show_time',
            field=models.CharField(max_length=50),
        ),
    ]
