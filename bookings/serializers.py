# bookings/serializers.py
from rest_framework import serializers
from .models import Booking
from flights.serializers import FlightSerializer


class BookingSerializer(serializers.ModelSerializer):
    flight_details = FlightSerializer(source='flight', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('booking_reference', 'booking_date', 'total_price')

    def validate(self, data):
        flight = data.get('flight')
        passengers_count = data.get('passengers_count', 1)

        if flight.available_seats < passengers_count:
            raise serializers.ValidationError(
                f"Not enough seats available. Only {flight.available_seats} seats left."
            )

        return data

    def create(self, validated_data):
        booking = Booking.objects.create(**validated_data)
        # Update available seats
        booking.flight.available_seats -= booking.passengers_count
        booking.flight.save()
        return booking