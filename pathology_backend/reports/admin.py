from django.contrib import admin
from .models import PatientTest, Report


@admin.register(PatientTest)
class PatientTestAdmin(admin.ModelAdmin):
    list_display = ('patient', 'test', 'status', 'lab', 'test_date')
    list_filter = ('status', 'lab')
    search_fields = ('patient__full_name', 'test__name')


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('patient', 'lab', 'file', 'created_at')
    search_fields = ('patient__full_name', 'lab__name')
