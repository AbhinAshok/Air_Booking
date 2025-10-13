# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'approval_status', 'is_staff', 'date_joined')
    list_filter = ('approval_status', 'is_staff', 'date_joined')
    fieldsets = UserAdmin.fieldsets + (
        ('Approval Status', {'fields': ('approval_status',)}),
    )
    actions = ['approve_users', 'reject_users']

    def approve_users(self, request, queryset):
        queryset.update(approval_status='approved')
    approve_users.short_description = "Approve selected users"

    def reject_users(self, request, queryset):
        queryset.update(approval_status='rejected')
    reject_users.short_description = "Reject selected users"