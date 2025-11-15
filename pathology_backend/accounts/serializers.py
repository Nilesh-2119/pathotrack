# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from labs.models import Lab

User = get_user_model()


# --------------------------------------------------------
# REGISTER SERIALIZER
# --------------------------------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    lab = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'phone',
            'password',
            'password2',
            'role',
            'lab'
        ]

    def validate(self, attrs):
        # Passwords match check
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": ["Passwords do not match."]}
            )

        # Email unique check
        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError(
                {"email": ["Email is already registered."]}
            )

        # Phone unique check
        phone = attrs.get("phone")
        if phone and User.objects.filter(phone=phone).exists():
            raise serializers.ValidationError(
                {"phone": ["Phone number already registered."]}
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        password = validated_data.pop("password")
        lab_id = validated_data.pop("lab", None)

        user = User(**validated_data)
        user.set_password(password)

        # ✔ Attach lab if provided
        if lab_id is not None:
            try:
                lab_instance = Lab.objects.get(id=lab_id)
                user.lab = lab_instance
            except Lab.DoesNotExist:
                raise serializers.ValidationError(
                    {"lab": ["Invalid lab ID."]}
                )

        user.save()
        return user


# --------------------------------------------------------
# USER SERIALIZER (USED FOR PROFILE)
# --------------------------------------------------------
class UserSerializer(serializers.ModelSerializer):
    lab = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'phone',
            'role',
            'lab'
        ]
