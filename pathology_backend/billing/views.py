from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Bill
from .serializers import BillSerializer


class BillListCreateView(generics.ListCreateAPIView):
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == user.SUPERADMIN:
            return Bill.objects.all()
        return Bill.objects.filter(lab=user.lab)

    def perform_create(self, serializer):
        user = self.request.user
        bill = serializer.save(lab=user.lab, created_by=user)
        bill.calculate_total()


class BillDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == user.SUPERADMIN:
            return Bill.objects.all()
        return Bill.objects.filter(lab=user.lab)

    def perform_update(self, serializer):
        bill = serializer.save()
        bill.calculate_total()
