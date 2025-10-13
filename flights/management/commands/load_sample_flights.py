# flights/management/commands/load_sample_flights.py
from django.core.management.base import BaseCommand
from flights.models import Flight
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Load sample flight data'

    def handle(self, *args, **options):
        airports = [
            ('DEL', 'New Delhi'),
            ('BOM', 'Mumbai'),
            ('BLR', 'Bengaluru'),
            ('MAA', 'Chennai'),
            ('HYD', 'Hyderabad'),
            ('CCU', 'Kolkata'),
            ('COK', 'Kochi')
        ]

        airlines = ['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'Go First', 'AirAsia India']

        # Clear existing flights
        Flight.objects.all().delete()

        flights = []
        base_time = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

        for i in range(50):
            departure_airport = random.choice(airports)
            arrival_airport = random.choice([a for a in airports if a != departure_airport])

            flight = Flight(
                flight_number=f'AI{random.randint(1000, 9999)}',
                airline=random.choice(airlines),
                departure_airport=f"{departure_airport[0]} - {departure_airport[1]}",
                arrival_airport=f"{arrival_airport[0]} - {arrival_airport[1]}",
                departure_time=base_time + timedelta(days=random.randint(1, 30), hours=random.randint(0, 23)),
                arrival_time=base_time + timedelta(days=random.randint(1, 30), hours=random.randint(1, 24)),
                price=random.randint(2000, 15000),
                total_seats=180,
                available_seats=random.randint(10, 180),
                status=random.choice(['scheduled', 'on_time', 'delayed'])
            )
            flights.append(flight)

        Flight.objects.bulk_create(flights)
        self.stdout.write(self.style.SUCCESS(f'Successfully loaded {len(flights)} sample flights'))