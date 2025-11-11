# accounts/views_password.py

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers_password import (
    PasswordResetRequestSerializer,
)
from django.core.mail import send_mail
from django.conf import settings

User = get_user_model()


# ✅ 1. Request password reset (send email)
class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [permissions.AllowAny]  # Public

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user = User.objects.filter(email=email).first()

        if not user:
            return Response(
                {"detail": "No account found with this email."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Send password reset email (simplified)
        reset_link = f"http://localhost:5173/reset-password?email={email}"
        send_mail(
            subject="🔒 Reset Your PathoTrack Password",
            message=f"Hello {user.username},\n\nClick below to reset your password:\n{reset_link}\n\nIf you didn’t request this, please ignore this email.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response(
            {"message": "Password reset email sent successfully."},
            status=status.HTTP_200_OK,
        )


# ✅ 2. Confirm password reset (change password)
class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]  # ✅ Make it public

    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")

        if not email or not new_password:
            return Response(
                {"detail": "Email and new password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return Response(
                {"message": "Password reset successful! You can now log in."},
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
