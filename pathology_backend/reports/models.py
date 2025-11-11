from django.db import models
from accounts.models import Lab, CustomUser
from patients.models import Patient
from tests.models import Test


class PatientTest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Delivered', 'Delivered'),
    ]

    patient = models.ForeignKey(
        Patient, on_delete=models.CASCADE, related_name='assigned_tests')
    test = models.ForeignKey(
        Test, on_delete=models.CASCADE, related_name='patient_assignments')
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE,
                            related_name='patient_tests')
    assigned_by = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='tests_assigned')

    test_date = models.DateField(auto_now_add=True)
    result_value = models.CharField(max_length=100, blank=True, null=True)
    result_unit = models.CharField(max_length=50, blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"{self.patient.full_name} → {self.test.name} ({self.status})"


class Report(models.Model):
    lab = models.ForeignKey(
        Lab, on_delete=models.CASCADE, related_name='reports')
    patient = models.ForeignKey(
        Patient, on_delete=models.CASCADE, related_name='reports')
    generated_by = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    file = models.FileField(upload_to='reports/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Report for {self.patient.full_name} ({self.lab.name})"
