from rest_framework import serializers
from .models import Patient
from tests.models import Test


class TestInlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ["id", "name", "price"]


class PatientSerializer(serializers.ModelSerializer):
    tests = TestInlineSerializer(many=True, read_only=True)
    test_ids = serializers.PrimaryKeyRelatedField(
        queryset=Test.objects.all(), many=True, write_only=True, required=False
    )
    created_by_name = serializers.CharField(
        source="created_by.username", read_only=True)

    class Meta:
        model = Patient
        fields = "__all__"
        read_only_fields = ["lab", "created_by", "sample_collected_on"]

    def create(self, validated_data):
        test_ids = validated_data.pop("test_ids", [])
        patient = Patient.objects.create(**validated_data)
        patient.tests.set(test_ids)
        return patient

    def update(self, instance, validated_data):
        test_ids = validated_data.pop("test_ids", None)
        patient = super().update(instance, validated_data)

        if test_ids is not None:
            patient.tests.set(test_ids)

        return patient
