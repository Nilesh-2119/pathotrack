# accounts/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    ProfileView,
    CustomTokenObtainPairView,
    ForgotPasswordView,  # ✅ Our simple email-based reset (optional)
)
from .views_password import (
    PasswordResetRequestView,
    PasswordResetConfirmView,  # ✅ Handles actual password change
)

urlpatterns = [
    # 🔐 Authentication & JWT
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # 👤 User Profile
    path("profile/", ProfileView.as_view(), name="profile"),

    # 🔑 Password Reset (Optional email notification route)
    path("password-reset/", ForgotPasswordView.as_view(), name="forgot-password"),

    # 🔒 Real Password Reset Flow (via views_password.py)
    path("password-reset/request/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),

]
