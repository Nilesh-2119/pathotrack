# labs/models.py
from django.db import models


class Lab(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField(blank=True, null=True)
    contact_email = models.EmailField(unique=True)  # ✅ ensure unique
    phone = models.CharField(max_length=15, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
