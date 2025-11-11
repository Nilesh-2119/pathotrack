# accounts/serializers_password.py
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import smart_bytes, smart_str, DjangoUnicodeDecodeError
from django.core.mail import send_mail
from django.conf import settings

User = get_user_model()


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No account found with this email.")
        return value

    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)

        token = PasswordResetTokenGenerator().make_token(user)
        uid = urlsafe_base64_encode(smart_bytes(user.id))

        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
        send_mail(
            subject="Reset your PathoTrack account password",
            message=f"Hello {user.username},\n\nClick below to reset your password:\n{reset_link}\n\nIf you didn’t request this, please ignore.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )
        return {"email": email}


class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            uid = smart_str(urlsafe_base64_decode(attrs["uidb64"]))
            user = User.objects.get(id=uid)
        except (DjangoUnicodeDecodeError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid reset link.")

        token = attrs["token"]
        if not PasswordResetTokenGenerator().check_token(user, token):
            raise serializers.ValidationError("Reset link has expired or is invalid.")

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")

        user.set_password(attrs["new_password"])
        user.save()
        return {"message": "Password reset successful."}
