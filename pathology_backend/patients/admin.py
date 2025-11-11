from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'age', 'gender', 'lab', 'status', 'sample_collected_on')
    list_filter = ('lab', 'gender', 'status')
    search_fields = ('full_name', 'phone', 'email')
