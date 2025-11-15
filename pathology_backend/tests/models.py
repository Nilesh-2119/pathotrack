from django.db import models
from labs.models import Lab


class Tube(models.Model):
    lab = models.ForeignKey(
        Lab,
        on_delete=models.CASCADE,
        related_name="test_tubes",
        null=True,
        blank=True
    )
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Test(models.Model):
    CATEGORY_CHOICES = [
        ('Blood', 'Blood Test'),
        ('Urine', 'Urine Test'),
        ('Imaging', 'Imaging'),
        ('Other', 'Other'),
    ]

    lab = models.ForeignKey(
        Lab,
        on_delete=models.CASCADE,
        related_name="tests"      # FIXED 🔥
    )
    name = models.CharField(max_length=200)
    category = models.CharField(
        max_length=50, choices=CATEGORY_CHOICES, default='Blood')
    description = models.TextField(blank=True, null=True)
    normal_range = models.CharField(max_length=100, blank=True, null=True)
    unit = models.CharField(max_length=50, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    # NEW many-to-many
    tubes = models.ManyToManyField(Tube, related_name="tests", blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.lab.name}"
