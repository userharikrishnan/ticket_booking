from django.db import models
from django.contrib.auth.models import User
import random
from django.core.validators import EmailValidator

class Customer(models.Model):
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=50)

class Movie(models.Model):
    Title = models.CharField(max_length=100)
    Image_url = models.URLField(max_length=200, default="https://placehold.co/200x250")
    Genere = models.CharField(max_length=50)
    Description = models.TextField(max_length=1200)
    Price = models.DecimalField(max_digits=6, decimal_places=2)
    Trailer = models.URLField(max_length=100)
    Show_timeOne = models.CharField(max_length=50)
    Show_timeTwo = models.CharField(max_length=50, default='')
    Show_timeThree = models.CharField(max_length=50, default='')
    Show_dateOne = models.DateField(null=True, blank=True)
    Show_dateTwo = models.DateField(null=True, blank=True)
    Show_dateThree = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return self.Title


class BookingRegister(models.Model):
    booking_id = models.CharField(max_length=8, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, null=True, blank=True)
    booking_date = models.DateField()
    booking_time = models.CharField(max_length=10)
    quantity = models.PositiveIntegerField()
    booked_date = models.CharField(max_length=20, default='')
   
    show_date = models.CharField(max_length=10)
    moviename = models.CharField(max_length=40, default='')
    total_price = models.DecimalField(max_digits=6, decimal_places=2, default=180.00)
    

    def save(self, *args, **kwargs):
        while True:
            booking_id = ''.join(random.choices('0123456789', k=8))
            if not BookingRegister.objects.filter(booking_id=booking_id).exists():
                self.booking_id = booking_id
                break
        super().save(*args, **kwargs)