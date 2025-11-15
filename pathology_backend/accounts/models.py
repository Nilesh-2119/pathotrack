# accounts/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from labs.models import Lab

class CustomUser(AbstractUser):
    SUPERADMIN = 'SUPERADMIN'
    LAB_ADMIN = 'LAB_ADMIN'
    COLLECTION_BOY = 'COLLECTION_BOY'

    ROLE_CHOICES = [
        (SUPERADMIN, 'SuperAdmin'),
        (LAB_ADMIN, 'LabAdmin'),
        (COLLECTION_BOY, 'CollectionBoy'),
    ]

    email = models.EmailField(unique=True, null=True, blank=True)
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)

    full_name = models.CharField(max_length=150, null=True, blank=True)
    emp_id = models.CharField(max_length=50, unique=True, null=True, blank=True)

    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default=COLLECTION_BOY)
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, null=True, blank=True, related_name='users')

    def __str__(self):
        return f"{self.username} ({self.role})"
