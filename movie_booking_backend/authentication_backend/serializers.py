from rest_framework import serializers
from .models import Movie, BookingRegister

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingRegister
        fields = '__all__'