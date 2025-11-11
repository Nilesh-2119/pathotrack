from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser  # ✅ remove Lab import


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'lab')}),
    )
    list_display = ('username', 'email', 'role', 'lab', 'is_active', 'is_staff')
    list_filter = ('role', 'lab', 'is_staff')
