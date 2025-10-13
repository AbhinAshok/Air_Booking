# flights/serializers.py
from rest_framework import serializers
from .models import Flight

class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class FlightSearchSerializer(serializers.Serializer):
    departure_airport = serializers.CharField(required=False)
    arrival_airport = serializers.CharField(required=False)
    departure_date = serializers.DateField(required=False)
    passengers = serializers.IntegerField(default=1, min_value=1)

class FlightStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = ('status',)