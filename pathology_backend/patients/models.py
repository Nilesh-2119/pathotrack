from django.db import models
from accounts.models import Lab, CustomUser
from tests.models import Test   # <-- correct model import


class Patient(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    lab = models.ForeignKey(
        Lab, on_delete=models.CASCADE, related_name='patients'
    )
    created_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='added_patients'
    )

    full_name = models.CharField(max_length=200)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    phone = models.CharField(max_length=15, blank=True, null=True)

    referred_by = models.CharField(max_length=200, blank=True, null=True)

    # Many tests for one patient
    tests = models.ManyToManyField(Test, related_name="patient_tests")

    # Money fields
    total_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0)
    concession = models.DecimalField(
        max_digits=10, decimal_places=2, default=0)
    final_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0)
    paid_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0)
    pending_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0)

    sample_date = models.DateField(null=True, blank=True)
    sample_collected_on = models.DateTimeField(auto_now_add=True)

    status = models.CharField(max_length=50, default="Pending")

    def __str__(self):
        return f"{self.full_name} ({self.lab.name})"
