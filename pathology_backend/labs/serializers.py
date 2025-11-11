# labs/serializers.py
from rest_framework import serializers
from .models import Lab

class LabSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lab
        fields = ['id', 'name', 'address', 'contact_email', 'phone', 'created_at']

    def validate_contact_email(self, value):
        if Lab.objects.filter(contact_email=value).exists():
            raise serializers.ValidationError("Lab with this email already exists.")
        return value

    def validate_phone(self, value):
        if Lab.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone number already registered.")
        return value
