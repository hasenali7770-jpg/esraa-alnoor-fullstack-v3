from django.conf import settings
from rest_framework import permissions

class IsAdminEmail(permissions.BasePermission):
    def has_permission(self, request, view):
        email = (getattr(getattr(request, "user", None), "email", "") or "").lower()
        return email in settings.ADMIN_EMAILS
