from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Sum, Q
from patients.models import Patient
from reports.models import PatientTest, Report
from billing.models import Bill


class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # Superadmin sees all labs, others see only their own
        if user.role == user.SUPERADMIN:
            patient_count = Patient.objects.count()
            test_count = PatientTest.objects.count()
            report_count = Report.objects.count()
            revenue = Bill.objects.aggregate(
                total=Sum('paid_amount'))['total'] or 0
            pending_reports = PatientTest.objects.filter(
                status='Pending').count()
            completed_reports = PatientTest.objects.filter(
                status='Completed').count()
            labs_count = user.__class__.objects.filter(
                role='LAB_ADMIN').count()
        else:
            lab = user.lab
            patient_count = Patient.objects.filter(lab=lab).count()
            test_count = PatientTest.objects.filter(lab=lab).count()
            report_count = Report.objects.filter(lab=lab).count()
            revenue = Bill.objects.filter(lab=lab).aggregate(
                total=Sum('paid_amount'))['total'] or 0
            pending_reports = PatientTest.objects.filter(
                lab=lab, status='Pending').count()
            completed_reports = PatientTest.objects.filter(
                lab=lab, status='Completed').count()
            labs_count = None

        # Revenue breakdown by payment method
        payment_breakdown = Bill.objects.values('payment_method').annotate(
            total_paid=Sum('paid_amount')
        )

        return Response({
            "patients": patient_count,
            "tests_assigned": test_count,
            "reports_generated": report_count,
            "revenue_collected": revenue,
            "pending_reports": pending_reports,
            "completed_reports": completed_reports,
            "labs_count": labs_count,
            "payment_breakdown": payment_breakdown,
        })
