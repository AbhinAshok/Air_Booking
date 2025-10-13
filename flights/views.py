# flights/views.py (Corrected)
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import Flight
from .serializers import FlightSerializer, FlightSearchSerializer, FlightStatusUpdateSerializer


class FlightSearchView(generics.ListAPIView):
    serializer_class = FlightSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Flight.objects.filter(departure_time__gte=timezone.now())

        serializer = FlightSearchSerializer(data=self.request.query_params)
        if serializer.is_valid():
            departure_airport = serializer.validated_data.get('departure_airport')
            arrival_airport = serializer.validated_data.get('arrival_airport')
            departure_date = serializer.validated_data.get('departure_date')
            passengers = serializer.validated_data.get('passengers', 1)

            if departure_airport:
                queryset = queryset.filter(departure_airport__icontains=departure_airport)
            if arrival_airport:
                queryset = queryset.filter(arrival_airport__icontains=arrival_airport)
            if departure_date:
                queryset = queryset.filter(departure_time__date=departure_date)

            # Filter by available seats
            queryset = queryset.filter(available_seats__gte=passengers)

        return queryset


class FlightDetailView(generics.RetrieveAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [permissions.IsAuthenticated]


class FlightManagementView(generics.ListCreateAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [permissions.IsAdminUser]


class FlightStatusUpdateView(generics.UpdateAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightStatusUpdateSerializer
    permission_classes = [permissions.IsAdminUser]

    def update(self, request, *args, **kwargs):
        flight = self.get_object()
        serializer = self.get_serializer(flight, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": f"Flight status updated to {flight.status}",
                "flight": FlightSerializer(flight).data
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)