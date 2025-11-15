# expenses/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Expense
from .serializers import ExpenseSerializer


class IsAuthenticatedAndLabMember(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated


def _is_admin_like(user):
    # Use your project's role constants (you used user.SUPERADMIN and user.LAB_ADMIN elsewhere)
    return getattr(user, "role", None) in (getattr(user, "SUPERADMIN", None), getattr(user, "LAB_ADMIN", None))


class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticatedAndLabMember]

    def get_queryset(self):
        user = self.request.user
        qs = Expense.objects.all()

        # restrict to user's lab (unless superadmin)
        if getattr(user, "role", None) == getattr(user, "SUPERADMIN", None):
            qs = qs
        else:
            qs = qs.filter(lab=user.lab)

        # optional date filter ?date=YYYY-MM-DD
        date = self.request.query_params.get("date")
        if date:
            qs = qs.filter(date=date)

        return qs.order_by("-created_at")

    def perform_create(self, serializer):
        user = self.request.user
        # Only admin-like users can add expenses
        if not _is_admin_like(user):
            raise PermissionDenied("Only admins can add expenses.")
        serializer.save(lab=user.lab, created_by=user)


class ExpenseDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticatedAndLabMember]

    def get_queryset(self):
        user = self.request.user
        qs = Expense.objects.all()
        if getattr(user, "role", None) == getattr(user, "SUPERADMIN", None):
            qs = qs
        else:
            qs = qs.filter(lab=user.lab)
        return qs

    def destroy(self, request, *args, **kwargs):
        user = request.user
        if not _is_admin_like(user):
            raise PermissionDenied("Only admins can delete expenses.")
        return super().destroy(request, *args, **kwargs)
