# accounts/serializers_staff.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "phone", "emp_id", "role", "lab"]


class AddStaffSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )

    class Meta:
        model = User
        fields = ["username", "phone", "password"]

    def validate_username(self, value):
        if " " in value:
            raise serializers.ValidationError(
                "Username cannot contain spaces.")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_phone(self, value):
        if not value.isdigit() or len(value) < 10:
            raise serializers.ValidationError(
                "Enter a valid 10-digit phone number.")
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone number already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")

        # ✅ Auto-generate emp_id like EMP001, EMP002, etc.
        last_user = User.objects.filter(
            emp_id__isnull=False).order_by("-id").first()
        next_number = 1
        if last_user and last_user.emp_id and last_user.emp_id.startswith("EMP"):
            try:
                next_number = int(last_user.emp_id.replace("EMP", "")) + 1
            except ValueError:
                pass

        validated_data["emp_id"] = f"EMP{next_number:03d}"
        validated_data["email"] = None  # Prevent duplicate empty email error

        user = User(**validated_data)
        user.set_password(password)
        user.role = "COLLECTION_BOY"
        user.save()
        return user
