from rest_framework import generics, permissions
from .models import Test
from .serializers import TestSerializer


class TestListCreateView(generics.ListCreateAPIView):
    serializer_class = TestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == user.SUPERADMIN:
            return Test.objects.all()
        return Test.objects.filter(lab=user.lab)

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(lab=user.lab)


class TestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == user.SUPERADMIN:
            return Test.objects.all()
        return Test.objects.filter(lab=user.lab)
