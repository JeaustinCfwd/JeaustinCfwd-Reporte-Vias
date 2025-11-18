from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .permissions import IsAdminRole, IsOwnerOrAdminCanApprove
from rest_framework.decorators import api_view, permission_classes
from .models import Usuario, Reporte, Estado, Comentario, Rol, ImagenReporte
from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from django.contrib.auth import authenticate

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

class LoginUsuarioView(APIView):
 def post(self,request):
  nombre_usuario = request.data.get("username")
  clave_usuario = request.data.get("password")
  
  usuario = authenticate(username=nombre_usuario,password=clave_usuario)
  
  if usuario is not None:
   return Response({"mensaje":"Inicio exitoso"})
  else:
   return Response({"mensaje":"Inicio fallido, error 404"})
   


# ===== REPORTES =====
class ReporteCreateView(ListCreateAPIView):
    queryset = Reporte.objects.all().order_by('-fecha_creacion')
    serializer_class = ReporteSerializer
    # permission_classes = [IsAuthenticated]

# el list create api view sirve para un get y un post 
class EstadoCreateView(ListCreateAPIView):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer
    permission_classes = [IsAdminUser]

class ComentarioCreateView(ListCreateAPIView):
    queryset = Comentario.objects.all().order_by('-fecha_creacion')
    serializer_class = ComentarioSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class ImagenReporteCreateView(ListCreateAPIView):
    queryset = ImagenReporte.objects.all()
    serializer_class = ImagenReporteSerializer
    permission_classes = [IsAuthenticated]


class RolCreateView(ListCreateAPIView):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [IsAdminRole]


class ListUsersCreateView(ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminUser]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_usuario_actual(request):
    """Retorna los datos del usuario autenticado"""
    serializer = UsuarioSerializer(request.user)
    return Response(serializer.data)