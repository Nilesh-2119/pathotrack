from rest_framework import generics, permissions
from .models import Patient
from .serializers import PatientSerializer

class PatientListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show patients from the logged-in user's lab
        user = self.request.user
        if user.role == user.SUPERADMIN:
            return Patient.objects.all()
        return Patient.objects.filter(lab=user.lab)

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(lab=user.lab, created_by=user)


class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == user.SUPERADMIN:
            return Patient.objects.all()
        return Patient.objects.filter(lab=user.lab)
