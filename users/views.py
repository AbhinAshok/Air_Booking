# users/views.py (Updated - Remove Celery Reference)
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import User
from .serializers import UserRegistrationSerializer, UserSerializer, UserApprovalSerializer


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Send registration confirmation email (synchronous)
            try:
                subject = 'Welcome to AirBooking - Registration Received'
                html_message = render_to_string('emails/registration_received.html', {
                    'user': user,
                    'site_name': 'AirBooking'
                })
                plain_message = strip_tags(html_message)

                send_mail(
                    subject=subject,
                    message=plain_message,
                    html_message=html_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Registration email failed: {e}")
                # Continue even if email fails

            return Response({
                "message": "User registered successfully. Waiting for admin approval.",
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from django.contrib.auth import authenticate

        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            if user.approval_status != 'approved':
                return Response({
                    "error": "Your account is pending approval. Please wait for admin approval."
                }, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        else:
            return Response({
                "error": "Invalid credentials"
            }, status=status.HTTP_401_UNAUTHORIZED)


class UserProfileView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class PendingUsersView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        pending_users = User.objects.filter(approval_status='pending')
        serializer = UserSerializer(pending_users, many=True)
        return Response(serializer.data)


# class ApproveUserView(APIView):
#     permission_classes = [permissions.IsAdminUser]
#
#     def post(self, request, user_id):
#         try:
#             user = User.objects.get(id=user_id, approval_status='pending')
#         except User.DoesNotExist:
#             return Response({"error": "User not found or already processed"},
#                             status=status.HTTP_404_NOT_FOUND)
#
#         action = request.data.get('action')
#         if action == 'approve':
#             user.approval_status = 'approved'
#             user.save()
#
#             # Send approval email (synchronous - no Celery)
#             try:
#                 subject = 'Account Approved - AirBooking'
#                 html_message = render_to_string('emails/account_approved.html', {
#                     'user': user,
#                     'site_name': 'AirBooking'
#                 })
#                 plain_message = strip_tags(html_message)
#
#                 send_mail(
#                     subject=subject,
#                     message=plain_message,
#                     html_message=html_message,
#                     from_email=settings.DEFAULT_FROM_EMAIL,
#                     recipient_list=[user.email],
#                     fail_silently=False,
#                 )
#             except Exception as e:
#                 print(f"Approval email failed: {e}")
#                 # Continue even if email fails
#
#             return Response({"message": "User approved successfully"})
#
#         elif action == 'reject':
#             user.approval_status = 'rejected'
#             user.save()
#
#             # Send rejection email (synchronous)
#             try:
#                 subject = 'Account Registration Update - AirBooking'
#                 html_message = render_to_string('emails/account_rejected.html', {
#                     'user': user,
#                     'site_name': 'AirBooking'
#                 })
#                 plain_message = strip_tags(html_message)
#
#                 send_mail(
#                     subject=subject,
#                     message=plain_message,
#                     html_message=html_message,
#                     from_email=settings.DEFAULT_FROM_EMAIL,
#                     recipient_list=[user.email],
#                     fail_silently=False,
#                 )
#             except Exception as e:
#                 print(f"Rejection email failed: {e}")
#                 # Continue even if email fails
#
#             return Response({"message": "User rejected successfully"})
#
#         else:
#             return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)


class ApproveUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, approval_status='pending')
        except User.DoesNotExist:
            return Response({"error": "User not found or already processed"},
                            status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action')
        if action == 'approve':
            user.approval_status = 'approved'
            user.save()
            # ... email sending code
            return Response({"message": "User approved successfully"})

        elif action == 'reject':
            user.approval_status = 'rejected'
            user.save()
            # ... email sending code
            return Response({"message": "User rejected successfully"})

        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)