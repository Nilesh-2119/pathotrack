from django.db import models
from accounts.models import Lab, CustomUser
from patients.models import Patient
from reports.models import PatientTest


class Bill(models.Model):
    PAYMENT_STATUS = [
        ('Pending', 'Pending'),
        ('Partially Paid', 'Partially Paid'),
        ('Paid', 'Paid'),
        ('Cancelled', 'Cancelled'),
    ]

    PAYMENT_METHODS = [
        ('Cash', 'Cash'),
        ('Card', 'Card'),
        ('UPI', 'UPI'),
        ('Bank Transfer', 'Bank Transfer'),
    ]

    patient = models.ForeignKey(
        Patient, on_delete=models.CASCADE, related_name='bills')
    lab = models.ForeignKey(
        Lab, on_delete=models.CASCADE, related_name='bills')
    created_by = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_bills')
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00)
    paid_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00)
    balance = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00)
    payment_status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS, default='Pending')
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_METHODS, default='Cash')
    invoice_file = models.FileField(
        upload_to='invoices/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bill #{self.id} - {self.patient.full_name}"

    def calculate_total(self):
        patient_tests = PatientTest.objects.filter(
            patient=self.patient, lab=self.lab)
        total = sum(float(pt.test.price) for pt in patient_tests if pt.test)
        self.total_amount = total
        self.balance = total - float(self.paid_amount)
        self.payment_status = 'Paid' if self.balance <= 0 else 'Pending'
        self.save()
        return total
