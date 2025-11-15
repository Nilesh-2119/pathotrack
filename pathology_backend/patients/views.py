from rest_framework import generics, permissions
from .models import Patient
from .serializers import PatientSerializer
from tests.models import Test  # make sure this import exists


class PatientListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Super Admin sees all
        if user.role == user.SUPERADMIN:
            return Patient.objects.all()

        # Lab Admin sees all patients in their lab
        if user.role == user.LAB_ADMIN:
            return Patient.objects.filter(lab=user.lab)

        # Staff sees ONLY patients created by themselves
        if user.role == user.COLLECTION_BOY:
            return Patient.objects.filter(created_by=user)

        return Patient.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(
            lab=user.lab,
            created_by=user
        )


class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == user.SUPERADMIN:
            return Patient.objects.all()

        if user.role == user.LAB_ADMIN:
            return Patient.objects.filter(lab=user.lab)

        if user.role == user.COLLECTION_BOY:
            return Patient.objects.filter(created_by=user)

        return Patient.objects.none()
