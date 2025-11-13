from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """Permite acceso total solo a usuarios con rol 'Administrador'."""
    
    def has_permission(self, request, view):
        # Permitir lectura (GET, HEAD, OPTIONS) a cualquiera autenticado
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol and
            request.user.rol.lower() == 'administrador'
        )


class IsUserRole(permissions.BasePermission):
    """Permite acceso solo a usuarios con rol 'Usuario'."""
    
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol and
            request.user.rol.lower() == 'usuario'
        )


class IsAdminRole(permissions.BasePermission):
    """Permite acceso solo a usuarios con rol 'Administrador'."""
    
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'rol') and
            request.user.rol and
            request.user.rol.lower() == 'administrador'
        )
