from django.contrib import admin
from .models import Bill


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'lab', 'total_amount', 'paid_amount',
                    'balance', 'payment_status', 'payment_method', 'created_at')
    list_filter = ('payment_status', 'payment_method', 'lab')
    search_fields = ('patient__full_name', 'lab__name')
