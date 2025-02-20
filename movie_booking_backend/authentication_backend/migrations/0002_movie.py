# Generated by Django 5.0.3 on 2024-05-01 09:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication_backend', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Title', models.CharField(max_length=100)),
                ('Image_url', models.URLField(default='https://placehold.co/200x250')),
                ('Genere', models.CharField(max_length=50)),
                ('Description', models.TextField(max_length=1200)),
                ('Price', models.DecimalField(decimal_places=2, max_digits=6)),
                ('Trailer', models.URLField(max_length=100)),
                ('Show_time', models.JSONField(max_length=50)),
            ],
        ),
    ]
