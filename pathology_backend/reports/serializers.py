from rest_framework import serializers
from .models import PatientTest, Report


class PatientTestSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(
        source='patient.full_name', read_only=True)
    test_name = serializers.CharField(source='test.name', read_only=True)

    class Meta:
        model = PatientTest
        fields = '__all__'
        read_only_fields = ['lab', 'assigned_by', 'test_date']


class ReportSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(
        source='patient.full_name', read_only=True)
    lab_name = serializers.CharField(source='lab.name', read_only=True)

    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ['lab', 'generated_by', 'created_at', 'updated_at']
