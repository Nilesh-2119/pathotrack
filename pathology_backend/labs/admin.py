from django.contrib import admin
from .models import Lab

@admin.register(Lab)
class LabAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_email', 'created_at')
