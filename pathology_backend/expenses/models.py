# expenses/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from labs.models import Lab

User = settings.AUTH_USER_MODEL

class Expense(models.Model):
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name="expenses")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="created_expenses")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    note = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField(default=timezone.localdate)  # date of expense (selectable)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.lab.name} — ₹{self.amount} on {self.date}"
