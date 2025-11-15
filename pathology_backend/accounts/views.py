# accounts/views.py
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer
from labs.models import Lab
from rest_framework.permissions import IsAuthenticated

User = get_user_model()


# ✅ 1. Custom JWT Token Serializer (email-based login)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Allow login using email instead of username
        email = attrs.get("username")
        user = User.objects.filter(email=email).first()
        if user:
            attrs["username"] = user.username
        return super().validate(attrs)


# ✅ 2. Custom Token View
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ✅ 3. Register View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            return Response(
                {
                    "message": "✅ Lab Admin registered successfully.",
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            print("❌ Registration failed:", e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ✅ 4. Profile View
class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    # ⬅ only authenticated users allowed
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# ✅ Forgot Password View


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"email": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"email": ["No account found with this email."]}, status=status.HTTP_404_NOT_FOUND)

        reset_link = f"http://localhost:5173/reset-password?email={email}"

        send_mail(
            subject="PathoTrack Password Reset",
            message=f"Hi {user.username},\n\nClick this link to reset your password:\n{reset_link}\n\nIf you didn’t request this, ignore this email.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )

        return Response({"message": "Password reset link sent successfully."}, status=status.HTTP_200_OK)
