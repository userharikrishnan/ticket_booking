# Generated by Django 5.0.3 on 2024-05-25 03:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication_backend', '0008_alter_bookingregister_moviename'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='Show_dateOne',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='movie',
            name='Show_dateThree',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='movie',
            name='Show_dateTwo',
            field=models.DateField(blank=True, null=True),
        ),
    ]
