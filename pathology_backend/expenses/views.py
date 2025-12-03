# pathology_backend/expenses/views.py
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Expense
from .serializers import ExpenseSerializer

class IsAuthenticatedAndLabMember(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

def _is_admin_like(user):
    return getattr(user, "role", None) in (
        getattr(user, "SUPERADMIN", None),
        getattr(user, "LAB_ADMIN", None),
    )

class ExpenseListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedAndLabMember]
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Expense.objects.all()
        # Superadmin sees everything
        if getattr(user, "role", None) == getattr(user, "SUPERADMIN", None):
            return qs.order_by("-created_at")
        # Lab-admin sees their lab
        if _is_admin_like(user):
            return qs.filter(lab=user.lab).order_by("-created_at")
        # Others (collection boy) see only their own records
        return qs.filter(created_by=user).order_by("-created_at")

    def perform_create(self, serializer):
        user = self.request.user
        if not user or not user.is_authenticated:
            raise PermissionDenied("Authentication required.")
        # Allow non-admins (collection boy) to create their own expense
        lab = getattr(user, "lab", None)
        serializer.save(created_by=user, lab=lab)

class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedAndLabMember]
    serializer_class = ExpenseSerializer
    queryset = Expense.objects.all()

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if getattr(user, "role", None) == getattr(user, "SUPERADMIN", None):
            return obj
        if _is_admin_like(user) and obj.lab == user.lab:
            return obj
        if obj.created_by == user:
            return obj
        raise PermissionDenied("You do not have permission to view this expense.")

    def perform_update(self, serializer):
        user = self.request.user
        obj = self.get_object()
        if obj.created_by != user and not _is_admin_like(user):
            raise PermissionDenied("Only admins or the owner can update this expense.")
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        user = request.user
        if not _is_admin_like(user):
            raise PermissionDenied("Only admins can delete expenses.")
        return super().destroy(request, *args, **kwargs)
