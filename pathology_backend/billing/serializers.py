from rest_framework import serializers
from .models import Bill

class BillSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    lab_name = serializers.CharField(source='lab.name', read_only=True)

    class Meta:
        model = Bill
        fields = '__all__'
        read_only_fields = ['lab', 'created_by', 'total_amount', 'balance', 'created_at']
