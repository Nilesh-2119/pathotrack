# expenses/serializers.py
from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(
        source="created_by.username", read_only=True
    )

    class Meta:
        model = Expense
        fields = ["id", "lab", "created_by", "created_by_name",
                  "amount", "note", "date", "created_at"]
        read_only_fields = ["id", "created_by",
                            "created_at", "created_by_name", "lab"]
