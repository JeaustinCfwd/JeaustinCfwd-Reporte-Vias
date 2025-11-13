from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """Permite acceso total solo a usuarios con rol 'Administrador'."""
    
    def has_permission(self, request, view):
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


class IsOwnerOrAdminCanApprove(permissions.BasePermission):
        # Solo lectura permitida a cualquiera autenticado
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

         # Si el usuario es dueño del reporte → puede editar, pero no aprobar
        if obj.usuario == request.user and request.user.rol == "usuario":
            return True
        
        # Si es admin → puede hacer cualquier cosa (aprobar, eliminar, etc.)
        if request.user.rol == "admin":
            return True
        
        return False