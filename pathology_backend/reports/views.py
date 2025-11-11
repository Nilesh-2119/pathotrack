from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import PatientTest, Report
from .serializers import PatientTestSerializer, ReportSerializer
from .utils import generate_pdf_report


class PatientTestListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientTestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == user.SUPERADMIN:
            return PatientTest.objects.all()
        return PatientTest.objects.filter(lab=user.lab)

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(lab=user.lab, assigned_by=user)


class PatientTestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PatientTestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == user.SUPERADMIN:
            return PatientTest.objects.all()
        return PatientTest.objects.filter(lab=user.lab)


class GenerateReportView(generics.CreateAPIView):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        patient_id = request.data.get('patient')

        if not patient_id:
            return Response({"error": "Patient ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        report = Report.objects.create(
            patient_id=patient_id,
            lab=user.lab,
            generated_by=user
        )

        generate_pdf_report(report)
        serializer = self.get_serializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
