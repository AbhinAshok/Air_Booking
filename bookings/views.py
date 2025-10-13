# bookings/views.py
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer


class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).select_related('flight')


class BookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)


class CancelBookingView(generics.DestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()

        if booking.booking_status == 'cancelled':
            return Response(
                {"error": "Booking is already cancelled"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Perform cancellation logic
        booking.booking_status = 'cancelled'
        booking.flight.available_seats += booking.passengers_count
        booking.flight.save()
        booking.save()

        # Send cancellation email (synchronous)
        try:
            from django.core.mail import send_mail
            from django.template.loader import render_to_string
            from django.utils.html import strip_tags
            from django.conf import settings

            subject = f'Booking Cancelled - {booking.booking_reference}'
            html_message = render_to_string('emails/booking_cancelled.html', {
                'booking': booking,
                'user': booking.user,
                'flight': booking.flight,
            })
            plain_message = strip_tags(html_message)

            send_mail(
                subject=subject,
                message=plain_message,
                html_message=html_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[booking.user.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Cancellation email failed: {e}")

        return Response({
            "message": "Booking cancelled successfully",
            "booking": BookingSerializer(booking).data
        })