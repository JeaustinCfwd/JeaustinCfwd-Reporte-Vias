from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    CreateAdminUser, 
    CreateUser, 
    # ListUsersView,
    # ReporteViewSet, 
    # EstadoViewSet, 
    # ComentarioViewSet, 
    # ImagenReporteViewSet,
    # RolViewSet,
    ReporteCreateView,
    obtener_usuario_actual,
    EstadoCreateView,
    ComentarioCreateView,
    ImagenReporteCreateView,
    RolCreateView,
    LoginUsuarioView,
    ListUsersCreateView
)

router = DefaultRouter()
# router.register(r'usuarios', ListUsersView, basename='usuario')
# router.register(r'reportes', ReporteViewSet, basename='reporte')
# router.register(r'estados', EstadoViewSet, basename='estado')
# router.register(r'comentarios', ComentarioViewSet, basename='comentario')
# router.register(r'imagenes-reporte', ImagenReporteViewSet, basename='imagen-reporte')
# router.register(r'roles', RolViewSet, basename='rol')

urlpatterns = [
    # ===== AUTENTICACIÓN =====
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # ===== REGISTRO DE USUARIOS =====
    path('crear-admin/', CreateAdminUser.as_view(), name='create-admin'),
    path('crear-user/', CreateUser.as_view(), name='create-user'),
    
    # ===== USUARIO ACTUAL =====
    path('usuarios/me/', obtener_usuario_actual, name='usuario-actual'),
    
    # ===== ROUTER (CRUD ENDPOINTS) =====
    
    # ===== CREACION DE REPORTES =====
    path('crear-reporte/', ReporteCreateView.as_view(), name='crear-reporte'),
    path('crear-estado/', EstadoCreateView.as_view(), name='crear-estado'),
    path('crear-comentario/', ComentarioCreateView.as_view(), name='crear-comentario'),
    path('crear-imagen/', ImagenReporteCreateView.as_view(), name='crear-imagen'),
    path('crear-rol/', RolCreateView.as_view(), name='rol'),
    path('crear-lista/', ListUsersCreateView.as_view(), name='crear-lista'),
    path('login/', LoginUsuarioView.as_view(), name='login'),
]