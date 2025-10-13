# bookings/admin.py
from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_reference', 'user', 'flight', 'passengers_count', 
                   'total_price', 'payment_status', 'booking_status', 'booking_date')
    list_filter = ('payment_status', 'booking_status', 'booking_date')
    search_fields = ('booking_reference', 'user__username', 'flight__flight_number')
    date_hierarchy = 'booking_date'
    actions = ['mark_as_completed', 'mark_as_cancelled']

    def mark_as_completed(self, request, queryset):
        queryset.update(payment_status='completed')
    mark_as_completed.short_description = "Mark selected bookings as payment completed"

    def mark_as_cancelled(self, request, queryset):
        for booking in queryset:
            booking.cancel_booking()
    mark_as_cancelled.short_description = "Cancel selected bookings"