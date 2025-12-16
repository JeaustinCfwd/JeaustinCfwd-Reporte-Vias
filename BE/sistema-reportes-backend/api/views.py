from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListCreateAPIView
from django.contrib.auth import authenticate

from .permissions import IsAdminRole
from .models import Usuario, Reporte, Estado, Comentario, Rol, ImagenReporte
from .serializers import (
    UsuarioSerializer,
    ReporteSerializer,
    EstadoSerializer,
    ComentarioSerializer,
    RolSerializer,
    ImagenReporteSerializer
)

# ==========================
#   CREAR ADMIN & USUARIO
# ==========================

class CreateAdminUser(APIView):
    permission_classes = [AllowAny]  # Solo para registro inicial

    def post(self, request):
        data = request.data
        required_fields = ["username", "email", "password", "rol"]

        if not all(data.get(field) for field in required_fields):
            return Response({"error": "Faltan campos requeridos"}, status=400)

        Usuario.objects.create_superuser(
            username=data["username"],
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            email=data["email"],
            password=data["password"],
            rol=data["rol"],
        )

        return Response({"message": "Administrador creado"}, status=201)


class CreateUser(APIView):
    permission_classes = [AllowAny]  # Solo para registro

    def post(self, request):
        data = request.data
        required_fields = ["username", "email", "password", "rol"]

        if not all(data.get(field) for field in required_fields):
            return Response({"error": "Faltan campos requeridos"}, status=400)

        Usuario.objects.create_user(
            username=data["username"],
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            email=data["email"],
            password=data["password"],
            rol=data["rol"],
        )

        return Response({"message": "Usuario creado"}, status=201)


# ==========================
#         LOGIN
# ==========================

class LoginUsuarioView(APIView):
    permission_classes = [AllowAny]  # Permite login sin estar autenticado

    def post(self, request):
        nombre_usuario = request.data.get("username")
        clave_usuario = request.data.get("password")

        usuario = authenticate(username=nombre_usuario, password=clave_usuario)

        if usuario:
            return Response({"mensaje": "Inicio exitoso", "id": usuario.id})

        return Response({"mensaje": "Inicio fallido, error 404"})


# ==========================
#         REPORTES - CON AUTENTICACIÓN REQUERIDA
# ==========================

class ReporteCreateView(ListCreateAPIView):
    queryset = Reporte.objects.all().order_by('-fecha_creacion')
    serializer_class = ReporteSerializer
    permission_classes = [IsAuthenticated]  # ✅ REQUIERE LOGIN
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        # Asignar estado por defecto si no viene en el request
        estado_default = Estado.objects.first()
        
        if not estado_default:
            # Si no hay ningún estado, crear uno por defecto
            estado_default = Estado.objects.create(nombre="Pendiente")
        
        serializer.save(estado=estado_default)


class ReporteDeleteView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ REQUIERE LOGIN

    def delete(self, request, reporte_id):
        try:
            reporte = Reporte.objects.get(id=reporte_id)
            
            # Solo el dueño del reporte o admin puede eliminar
            if reporte.usuario != request.user and request.user.rol != "admin":
                return Response(
                    {"error": "No tienes permiso para eliminar este reporte"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            reporte.delete()
            return Response(
                {"mensaje": "Reporte eliminado exitosamente"},
                status=status.HTTP_200_OK
            )
        except Reporte.DoesNotExist:
            return Response(
                {"error": "Reporte no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )


class ReporteUpdateView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ REQUIERE LOGIN

    def put(self, request, reporte_id):
        reporte = get_object_or_404(Reporte, id=reporte_id)
        
        # Solo el dueño del reporte o admin puede editar
        if reporte.usuario != request.user and request.user.rol != "admin":
            return Response(
                {"error": "No tienes permiso para editar este reporte"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ReporteSerializer(reporte, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==========================
#         ESTADOS
# ==========================

class EstadoCreateView(ListCreateAPIView):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer
    permission_classes = [IsAdminUser]  # Solo admin


# ==========================
#       COMENTARIOS - CON AUTENTICACIÓN REQUERIDA
# ==========================

class ComentarioCreateView(ListCreateAPIView):
    queryset = Comentario.objects.all().order_by('-fecha_creacion')
    serializer_class = ComentarioSerializer
    permission_classes = [IsAuthenticated]  # ✅ REQUIERE LOGIN


class ComentarioDeleteView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ REQUIERE LOGIN

    def delete(self, request, comentario_id):
        comentario = get_object_or_404(Comentario, id=comentario_id)

        # Solo el dueño del comentario o admin puede eliminar
        if comentario.usuario != request.user and request.user.rol != "admin":
            return Response(
                {"error": "No tienes permiso para eliminar este comentario"},
                status=status.HTTP_403_FORBIDDEN
            )

        comentario.delete()

        return Response(
            {"mensaje": "Comentario eliminado exitosamente"},
            status=status.HTTP_200_OK
        )


# ==========================
#      IMÁGENES REPORTES
# ==========================

class ImagenReporteCreateView(ListCreateAPIView):
    queryset = ImagenReporte.objects.all()
    serializer_class = ImagenReporteSerializer
    permission_classes = [IsAuthenticated]  # ✅ REQUIERE LOGIN
    parser_classes = [MultiPartParser, FormParser]


# ==========================
#            ROLES
# ==========================

class RolCreateView(ListCreateAPIView):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [IsAdminRole]  # Solo admin


# ==========================
#          USUARIOS
# ==========================

class ListUsersCreateView(ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminUser]  # Solo admin


class UsuarioPorIdView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ REQUIERE LOGIN

    def get(self, request, id_usuario):
        # Solo puede ver su propio perfil o admin puede ver cualquiera
        if request.user.id != id_usuario and request.user.rol != "admin":
            return Response(
                {"error": "No tienes permiso para ver este perfil"},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        usuario = get_object_or_404(Usuario, id=id_usuario)
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id_usuario):
        usuario = get_object_or_404(Usuario, id=id_usuario)
        
        # Solo puede editar su propio perfil o admin puede editar cualquiera
        if request.user.id != id_usuario and request.user.rol != "admin":
            return Response(
                {"error": "No tienes permiso"},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsuarioIDViewDos(ListCreateAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]  # ✅ REQUIERE LOGIN
    
    def get_queryset(self):
        id_usuario = self.kwargs["id_usuario"]
        
        # Solo puede ver su propio perfil o admin puede ver cualquiera
        if self.request.user.id != id_usuario and self.request.user.rol != "admin":
            return Usuario.objects.none()
        
        return Usuario.objects.filter(id=id_usuario)


class UsuarioDeleteView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ REQUIERE LOGIN

    def delete(self, request, id_usuario):
        usuario = get_object_or_404(Usuario, id=id_usuario)

        # Solo el dueño de la cuenta o admin puede eliminar
        if request.user.id != usuario.id and request.user.rol != "admin":
            return Response(
                {"error": "No tienes permiso para eliminar este usuario"},
                status=status.HTTP_403_FORBIDDEN,
            )

        usuario.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class CambiarContrasenaView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ REQUIERE LOGIN

    def post(self, request):
        new_password = request.data.get("new_password")
        
        if not new_password:
            return Response(
                {"error": "Debes proporcionar la nueva contraseña"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Validar longitud de nueva contraseña
        if len(new_password) < 6:
            return Response(
                {"error": "La nueva contraseña debe tener al menos 6 caracteres"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Cambiar contraseña del usuario autenticado
        request.user.set_password(new_password)
        request.user.save()
        
        return Response(
            {"mensaje": "Contraseña cambiada exitosamente"},
            status=status.HTTP_200_OK
        )


class UsuarioActualizarView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ REQUIERE LOGIN
    
    def patch(self, request):
        id_usuario = request.data.get("id_usuario")
        imagen_perfil = request.data.get("img_perfil")

        if not id_usuario:
            return Response(
                {"error": "Debes proporcionar el id_usuario"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Solo puede actualizar su propio perfil o admin puede actualizar cualquiera
        if request.user.id != int(id_usuario) and request.user.rol != "admin":
            return Response(
                {"error": "No tienes permiso para actualizar este perfil"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            usuario = Usuario.objects.get(id=id_usuario)
        except Usuario.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if imagen_perfil:
            usuario.imagen_perfil = imagen_perfil
            usuario.save()
            return Response(
                {"mensaje": "Imagen de perfil actualizada exitosamente"},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": "Debes proporcionar una imagen de perfil"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class UsuarioFotoView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ REQUIERE LOGIN

    def get(self, request, id_usuario):
        # Solo puede ver foto de su propio perfil o admin puede ver cualquiera
        if request.user.id != id_usuario and request.user.rol != "admin":
            return Response(
                {"error": "No tienes permiso"},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        usuario = get_object_or_404(Usuario, id=id_usuario)
        foto = getattr(usuario, "imagen_perfil", None)
        return Response({"foto": foto}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # ✅ REQUIERE LOGIN
def obtener_usuario_actual(request):
    serializer = UsuarioSerializer(request.user)
    return Response(serializer.data)