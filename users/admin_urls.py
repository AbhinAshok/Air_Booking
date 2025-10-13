# users/admin_urls.py
from django.urls import path
from .views import PendingUsersView, ApproveUserView

urlpatterns = [
    path('users/pending/', PendingUsersView.as_view(), name='pending_users'),
    path('users/<int:user_id>/approve/', ApproveUserView.as_view(), name='approve_user'),
]