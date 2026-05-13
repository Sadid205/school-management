from rest_framework.permissions import BasePermission
from accounts.models import User

class RolePermission(BasePermission):
    def __init__(self,allowed_roles=None):
        self.allowed_roles = allowed_roles

    def has_permission(self, request, view):
        user = request.authenticated_user
        if not user:
            return False
        
        if not user.is_active or user.status in ["SUSPENDED","PENDING"]:
            return False
        
        if hasattr(view, "queryset") and view.queryset.model == User:
            if request.method in ['POST']:
                return user.role in ["ADMIN", "SUPER_ADMIN"]
            return True

        if self.allowed_roles is None:
            return True
        
        return user.role in self.allowed_roles

    def has_object_permission(self, request, view, obj):
        user = request.authenticated_user
        if not user:
            return False
        
        if not user.is_active or user.status in ["SUSPENDED","PENDING"]:
            return False

        if user.role in ["ADMIN", "SUPER_ADMIN"]:
            return True
        
        if isinstance(obj, User):
            return obj.id == user.id
        
        if self.allowed_roles is None:
            return True

        return user.role in self.allowed_roles 
