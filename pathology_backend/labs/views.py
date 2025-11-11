# labs/views.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Lab
from .serializers import LabSerializer

class LabViewSet(viewsets.ModelViewSet):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    permission_classes = [AllowAny]
