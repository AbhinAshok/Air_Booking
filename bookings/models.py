# bookings/models.py (Add email notification for bookings)
from django.db import models
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import uuid


class Booking(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    BOOKING_STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('pending', 'Pending'),
    ]

    booking_reference = models.CharField(max_length=8, unique=True, default=uuid.uuid4().hex[:8].upper())
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    flight = models.ForeignKey('flights.Flight', on_delete=models.CASCADE, related_name='bookings')
    passengers_count = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    booking_status = models.CharField(max_length=20, choices=BOOKING_STATUS_CHOICES, default='confirmed')
    booking_date = models.DateTimeField(auto_now_add=True)
    special_requests = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-booking_date']

    def __str__(self):
        return f"{self.booking_reference} - {self.user.username}"

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        if not self.booking_reference:
            self.booking_reference = uuid.uuid4().hex[:8].upper()
        if not self.total_price:
            self.total_price = self.flight.price * self.passengers_count

        super().save(*args, **kwargs)

        # Send booking confirmation email for new bookings
        if is_new and self.booking_status == 'confirmed':
            self.send_booking_confirmation()

    def send_booking_confirmation(self):
        """Send booking confirmation email synchronously"""
        try:
            subject = f'Booking Confirmation - {self.booking_reference}'
            html_message = render_to_string('emails/booking_confirmation.html', {
                'booking': self,
                'user': self.user,
                'flight': self.flight,
            })
            plain_message = strip_tags(html_message)

            send_mail(
                subject=subject,
                message=plain_message,
                html_message=html_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[self.user.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Booking confirmation email failed: {e}")

    def cancel_booking(self):
        """Cancel booking and free up seats"""
        if self.booking_status != 'cancelled':
            self.booking_status = 'cancelled'
            self.flight.available_seats += self.passengers_count
            self.flight.save()

            # Send cancellation email
            try:
                subject = f'Booking Cancelled - {self.booking_reference}'
                html_message = render_to_string('emails/booking_cancelled.html', {
                    'booking': self,
                    'user': self.user,
                    'flight': self.flight,
                })
                plain_message = strip_tags(html_message)

                send_mail(
                    subject=subject,
                    message=plain_message,
                    html_message=html_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[self.user.email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Cancellation email failed: {e}")

            self.save()