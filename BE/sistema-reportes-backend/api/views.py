from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .permissions import IsAdminRole, IsOwnerOrAdminCanApprove
from rest_framework.decorators import api_view, permission_classes


from .models import Usuario, Reporte, Estado, Comentario, Rol, ImagenReporte
from .serializers import (
    UsuarioSerializer,
    ReporteSerializer,
    EstadoSerializer,
    ComentarioSerializer,
    RolSerializer,
    ImagenReporteSerializer
)

class CreateAdminUser(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        email = request.data.get("email")
        password = request.data.get("password")
        rol = request.data.get("rol")

        if not all([username, email, password, rol]):
            return Response({"error": "Faltan campos requeridos"}, status=400)

        usuario = Usuario.objects.create_superuser(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
            rol=rol
        )
        return Response({"message": "Administrador creado"}, status=201)


class CreateUser(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        email = request.data.get("email")
        password = request.data.get("password")
        rol = request.data.get("rol")

        if not all([username, email, password, rol]):
            return Response({"error": "Faltan campos requeridos"}, status=400)

        usuario = Usuario.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
            rol=rol
        )
        return Response({"message": "Usuario creado"}, status=201)


# ===== REPORTES =====
class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all().order_by('-fecha_creacion')
    serializer_class = ReporteSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdminCanApprove]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user, aprobado=False)  # requiere aprobación del admin


class EstadoViewSet(viewsets.ModelViewSet):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer
    permission_classes = [IsAdminUser]


class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all().order_by('-fecha_creacion')
    serializer_class = ComentarioSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class ImagenReporteViewSet(viewsets.ModelViewSet):
    queryset = ImagenReporte.objects.all()
    serializer_class = ImagenReporteSerializer
    permission_classes = [IsAuthenticated]


class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [IsAdminRole]


class ListUsersView(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminUser]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_usuario_actual(request):
    """Retorna los datos del usuario autenticado"""
    serializer = UsuarioSerializer(request.user)
    return Response(serializer.data)