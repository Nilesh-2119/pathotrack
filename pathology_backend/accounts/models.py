from django.db import models
from django.contrib.auth.models import AbstractUser


class Lab(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField(blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    # ✅ Define constants first
    SUPERADMIN = 'SUPERADMIN'
    LAB_ADMIN = 'LAB_ADMIN'
    COLLECTION_BOY = 'COLLECTION_BOY'

    # ✅ Then define choices
    ROLE_CHOICES = [
        (SUPERADMIN, 'SuperAdmin'),
        (LAB_ADMIN, 'LabAdmin'),
        (COLLECTION_BOY, 'CollectionBoy'),
    ]

    # ✅ Then define your fields
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default=COLLECTION_BOY)
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, null=True, blank=True, related_name='users')

    def is_superadmin(self):
        return self.role == self.SUPERADMIN

    def is_lab_admin(self):
        return self.role == self.LAB_ADMIN

    def is_collection_boy(self):
        return self.role == self.COLLECTION_BOY
