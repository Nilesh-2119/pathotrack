# accounts/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from labs.models import Lab  # ✅ Reference to Lab model


class CustomUser(AbstractUser):
    # ✅ Role choices
    SUPERADMIN = 'SUPERADMIN'
    LAB_ADMIN = 'LAB_ADMIN'
    COLLECTION_BOY = 'COLLECTION_BOY'

    ROLE_CHOICES = [
        (SUPERADMIN, 'SuperAdmin'),
        (LAB_ADMIN, 'LabAdmin'),
        (COLLECTION_BOY, 'CollectionBoy'),
    ]

    # ✅ Unique email and phone
    email = models.EmailField(unique=True)  # replaces default non-unique email
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)

    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default=COLLECTION_BOY)
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, null=True, blank=True, related_name='users')

    def is_superadmin(self):
        return self.role == self.SUPERADMIN

    def is_lab_admin(self):
        return self.role == self.LAB_ADMIN

    def is_collection_boy(self):
        return self.role == self.COLLECTION_BOY

    def __str__(self):
        return f"{self.username} ({self.role})"
