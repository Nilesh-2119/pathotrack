# accounts/views_staff.py
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers_staff import StaffSerializer, AddStaffSerializer
from rest_framework.views import APIView
from django.db import IntegrityError

User = get_user_model()


# ✅ Allow only authenticated lab admins
class IsLabAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "LAB_ADMIN"
        )


# ✅ List all collection staff of current lab
class StaffListView(generics.ListAPIView):
    serializer_class = StaffSerializer
    permission_classes = [IsLabAdmin]

    def get_queryset(self):
        return User.objects.filter(role="COLLECTION_BOY", lab=self.request.user.lab)


# ✅ Add new staff (blood collection boy)
class AddStaffView(generics.CreateAPIView):
    serializer_class = AddStaffSerializer
    permission_classes = [IsLabAdmin]

    def create(self, request, *args, **kwargs):
        try:
            lab = request.user.lab
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save(role="COLLECTION_BOY", lab=lab)
            return Response(
                StaffSerializer(user).data, status=status.HTTP_201_CREATED
            )

        except IntegrityError as e:
            # Database-level constraint violation (e.g. unique phone/username)
            print("❌ IntegrityError while adding staff:", e)
            return Response(
                {"error": "Duplicate entry — username or phone already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            # If validation fails, return actual field errors instead of generic message
            print("❌ Error while adding staff:", repr(e))
            if hasattr(e, "detail"):  # Handle DRF ValidationError
                return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
            return Response(
                {"error": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )


# ✅ Reset staff password (only by Lab Admin)
class StaffPasswordResetView(APIView):
    permission_classes = [IsLabAdmin]

    def post(self, request, *args, **kwargs):
        staff_id = request.data.get("staff_id")
        new_password = request.data.get("new_password")

        if not staff_id or not new_password:
            return Response(
                {"detail": "Missing staff_id or new_password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            staff = User.objects.get(
                id=staff_id, lab=request.user.lab, role="COLLECTION_BOY"
            )
        except User.DoesNotExist:
            return Response(
                {"detail": "Staff not found or unauthorized."},
                status=status.HTTP_404_NOT_FOUND,
            )

        staff.set_password(new_password)
        staff.save()

        return Response(
            {"message": f"Password reset successful for {staff.username}."},
            status=status.HTTP_200_OK,
        )

# ✅ Delete Staff (Lab Admin only)
class StaffDeleteView(APIView):
    permission_classes = [IsLabAdmin]

    def delete(self, request, staff_id, *args, **kwargs):
        try:
            staff = User.objects.get(
                id=staff_id, lab=request.user.lab, role="COLLECTION_BOY"
            )
            username = staff.username
            staff.delete()
            return Response(
                {"message": f"Staff member '{username}' removed successfully."},
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {"detail": "Staff not found or unauthorized."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            print("❌ Error while deleting staff:", e)
            return Response(
                {"detail": "Error deleting staff. Check backend logs."},
                status=status.HTTP_400_BAD_REQUEST,
            )
