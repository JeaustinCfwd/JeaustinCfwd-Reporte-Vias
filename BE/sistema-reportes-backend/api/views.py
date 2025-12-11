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
    permission_classes = [AllowAny]

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
    permission_classes = [AllowAny]

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
    permission_classes = [AllowAny]

    def post(self, request):
        nombre_usuario = request.data.get("username")
        clave_usuario = request.data.get("password")

        usuario = authenticate(username=nombre_usuario, password=clave_usuario)

        if usuario:
            return Response({"mensaje": "Inicio exitoso", "id": usuario.id})

        return Response({"mensaje": "Inicio fallido, error 404"})


# ==========================
#         REPORTES
# ==========================

class ReporteCreateView(ListCreateAPIView):
    queryset = Reporte.objects.all().order_by('-fecha_creacion')
    serializer_class = ReporteSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]


class ReporteDeleteView(APIView):
    # permission_classes = [IsAuthenticated]

    def delete(self, request, reporte_id):
        try:
            reporte = Reporte.objects.get(id=reporte_id)
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
    # permission_classes = [IsAuthenticated]

    def put(self, request, reporte_id):
        reporte = get_object_or_404(Reporte, id=reporte_id)

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
    permission_classes = [IsAdminUser]


# ==========================
#       COMENTARIOS
# ==========================

class ComentarioCreateView(ListCreateAPIView):
    queryset = Comentario.objects.all().order_by('-fecha_creacion')
    serializer_class = ComentarioSerializer
    # permission_classes = [IsAuthenticated]


class ComentarioDeleteView(APIView):
    # permission_classes = [IsAuthenticated]

    def delete(self, request, comentario_id):
        comentario = get_object_or_404(Comentario, id=comentario_id)

        usuario_id = request.data.get('usuario_id') or request.query_params.get('usuario_id')

        if not usuario_id:
            return Response(
                {"error": "Debes proporcionar el usuario_id"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if comentario.usuario.id != int(usuario_id):
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
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]


# ==========================
#            ROLES
# ==========================

class RolCreateView(ListCreateAPIView):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [IsAdminRole]


# ==========================
#          USUARIOS
# ==========================

class ListUsersCreateView(ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminUser]


class UsuarioPorIdView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_usuario):
        usuario = get_object_or_404(Usuario, id=id_usuario)
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id_usuario):
        usuario = get_object_or_404(Usuario, id=id_usuario)
        if request.user.id != id_usuario and not request.user.is_staff:
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
 
 def get_queryset(self):
  id_usuario = self.kwargs["id_usuario"]
  return Usuario.objects.filter(id=id_usuario)


class UsuarioDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id_usuario):
        usuario = get_object_or_404(Usuario, id=id_usuario)

        # Solo el dueño de la cuenta o un admin/staff puede eliminar
        if request.user.id != usuario.id and not request.user.is_staff:
            return Response(
                {"error": "No tienes permiso para eliminar este usuario"},
                status=status.HTTP_403_FORBIDDEN,
            )

        usuario.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

class CambiarContrasenaView(APIView):
    permission_classes = [IsAuthenticated]

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
        
        # Cambiar contraseña sin verificar la actual
        request.user.set_password(new_password)
        request.user.save()
        
        return Response(
            {"mensaje": "Contraseña cambiada exitosamente"},
            status=status.HTTP_200_OK
        )

class UsuarioActualizarView(APIView):
    def patch(self, request):
        id_usuario = request.data.get("id_usuario")
        imagen_perfil = request.data.get("img_perfil")

        if not id_usuario:
            return Response(
                {"error": "Debes proporcionar el id_usuario"},
                status=status.HTTP_400_BAD_REQUEST,
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
    permission_classes = [IsAuthenticated]

    def get(self, request, id_usuario):
        usuario = get_object_or_404(Usuario, id=id_usuario)
        foto = getattr(usuario, "imagen_perfil", None)
        return Response({"foto": foto}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_usuario_actual(request):
    serializer = UsuarioSerializer(request.user)
    return Response(serializer.data)
