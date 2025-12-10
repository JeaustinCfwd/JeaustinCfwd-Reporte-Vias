from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    CreateAdminUser, 
    CreateUser, 
    ReporteCreateView,
    ReporteUpdateView,
    obtener_usuario_actual,
    EstadoCreateView,
    ComentarioCreateView,
    ImagenReporteCreateView,
    RolCreateView,
    LoginUsuarioView,
    ListUsersCreateView,
    UsuarioPorIdView,
    ComentarioDeleteView,
    ReporteDeleteView,
    UsuarioActualizarView
)

router = DefaultRouter()

urlpatterns = [
    # ===== AUTENTICACIÓN =====
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # ===== REGISTRO DE USUARIOS =====
    path('crear-admin/', CreateAdminUser.as_view(), name='create-admin'),
    path('crear-user/', CreateUser.as_view(), name='create-user'),
    
    # ===== USUARIO ACTUAL =====
    path('usuarios/me/', obtener_usuario_actual, name='usuario-actual'),
    
    # ===== CREACIÓN DE ELEMENTOS =====
    path('crear-reporte/', ReporteCreateView.as_view(), name='crear-reporte'),
    path('crear-estado/', EstadoCreateView.as_view(), name='crear-estado'),
    path('crear-comentario/', ComentarioCreateView.as_view(), name='crear-comentario'),
    path('crear-imagen/', ImagenReporteCreateView.as_view(), name='crear-imagen'),
    path('crear-rol/', RolCreateView.as_view(), name='rol'),
    path('crear-lista/', ListUsersCreateView.as_view(), name='crear-lista'),

    # ===== LOGIN =====
    path('login/', LoginUsuarioView.as_view(), name='login'),

    # ===== USUARIO POR ID =====
    path('usuario/<int:id_usuario>/', UsuarioPorIdView.as_view(), name='usuario-por-id'),
    path('actualizar-usuario/', UsuarioActualizarView.as_view(), name='actualizar-usuario'),

    # ===== ELIMINAR/EDITAR =====
    path('eliminar-comentario/<int:comentario_id>/', ComentarioDeleteView.as_view(), name='eliminar-comentario'),
    path('eliminar-reporte/<int:reporte_id>/', ReporteDeleteView.as_view(), name='eliminar-reporte'),
    path('editar-reporte/<int:reporte_id>/', ReporteUpdateView.as_view(), name='editar-reporte'),
]
