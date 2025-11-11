from django.urls import path
from .views import (
    PatientTestListCreateView,
    PatientTestDetailView,
    GenerateReportView,
)

urlpatterns = [
    path('', PatientTestListCreateView.as_view(),
         name='patient-test-list-create'),
    path('<int:pk>/', PatientTestDetailView.as_view(), name='patient-test-detail'),
    path('generate/', GenerateReportView.as_view(), name='generate-report'),
]
