from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Test
from .serializers import TestSerializer


class IsAuthenticatedAndLabMember(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated


class TestListCreateView(generics.ListCreateAPIView):
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticatedAndLabMember]

    def get_queryset(self):
        user = self.request.user
        # allow superadmin to see all tests
        if getattr(user, "role", None) == getattr(user, "SUPERADMIN", None):
            return Test.objects.all()
        return Test.objects.filter(lab=user.lab)

    def perform_create(self, serializer):
        # serializer.create handles tube creation and association
        serializer.save()


class TestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticatedAndLabMember]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "role", None) == getattr(user, "SUPERADMIN", None):
            return Test.objects.all()
        return Test.objects.filter(lab=user.lab)
