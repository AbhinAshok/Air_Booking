# bookings/urls.py
from django.urls import path
from .views import BookingCreateView, BookingListView, BookingDetailView, CancelBookingView

urlpatterns = [
    path('', BookingListView.as_view(), name='booking_list'),
    path('create/', BookingCreateView.as_view(), name='booking_create'),
    path('<int:pk>/', BookingDetailView.as_view(), name='booking_detail'),
    path('<int:pk>/cancel/', CancelBookingView.as_view(), name='booking_cancel'),
]

