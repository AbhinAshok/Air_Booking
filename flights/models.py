# flights/models.py
from django.db import models


class Flight(models.Model):
    FLIGHT_STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('on_time', 'On Time'),
        ('delayed', 'Delayed'),
        ('cancelled', 'Cancelled'),
        ('departed', 'Departed'),
        ('arrived', 'Arrived'),
    ]

    flight_number = models.CharField(max_length=10, unique=True)
    airline = models.CharField(max_length=100)
    departure_airport = models.CharField(max_length=100)
    arrival_airport = models.CharField(max_length=100)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    total_seats = models.IntegerField(default=180)
    available_seats = models.IntegerField()
    status = models.CharField(max_length=20, choices=FLIGHT_STATUS_CHOICES, default='scheduled')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['departure_time']

    def __str__(self):
        return f"{self.flight_number} - {self.departure_airport} to {self.arrival_airport}"

    def save(self, *args, **kwargs):
        if not self.available_seats:
            self.available_seats = self.total_seats
        super().save(*args, **kwargs)