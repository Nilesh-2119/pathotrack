from django.contrib import admin
from .models import Test


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price',
                    'lab', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'lab')
    search_fields = ('name', 'description')
