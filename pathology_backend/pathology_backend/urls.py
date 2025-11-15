# pathology_backend/urls.py
from django.contrib import admin
from django.urls import path, include

# import staff views from the accounts app (NOT from project root)
from accounts.views_staff import StaffListView, AddStaffView
from accounts.views_staff import StaffListView, AddStaffView, StaffPasswordResetView, StaffDeleteView


urlpatterns = [
    path('admin/', admin.site.urls),

    # API app includes
    path('api/auth/', include('accounts.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/tests/', include('tests.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/billing/', include('billing.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/labs/', include('labs.urls')),

    # Staff endpoints (under /api/)
    path('api/staff/', StaffListView.as_view(), name='staff-list'),
    path('api/staff/add/', AddStaffView.as_view(), name='add-staff'),

    path('api/staff/reset-password/', StaffPasswordResetView.as_view(),
         name='staff-reset-password'),

    path('api/staff/<int:staff_id>/delete/',
         StaffDeleteView.as_view(), name='delete-staff'),

    path("api/expenses/", include("expenses.urls")),

]
