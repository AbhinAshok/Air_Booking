# flights/admin.py
from django.contrib import admin
from .models import Flight

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ('flight_number', 'airline', 'departure_airport', 'arrival_airport', 
                   'departure_time', 'price', 'available_seats', 'status')
    list_filter = ('airline', 'departure_airport', 'arrival_airport', 'status', 'departure_time')
    search_fields = ('flight_number', 'airline', 'departure_airport', 'arrival_airport')
    date_hierarchy = 'departure_time'