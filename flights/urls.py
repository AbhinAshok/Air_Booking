# flights/urls.py
from django.urls import path
from .views import FlightSearchView, FlightDetailView, FlightManagementView, FlightStatusUpdateView

urlpatterns = [
    path('search/', FlightSearchView.as_view(), name='flight_search'),
    path('<int:pk>/', FlightDetailView.as_view(), name='flight_detail'),
    path('admin/flights/', FlightManagementView.as_view(), name='flight_management'),
    path('admin/flights/<int:pk>/status/', FlightStatusUpdateView.as_view(), name='flight_status_update'),
]