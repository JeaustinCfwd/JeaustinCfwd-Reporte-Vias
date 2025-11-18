from rest_framework import serializers
from .models import Estado, Rol, Usuario, Reporte, ImagenReporte, Comentario

class EstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado
        fields = '__all__'

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True)
    
    class Meta:
        model = Usuario
        fields = [
            'id', 
            'username', 
            'email', 
            'first_name', 
            'last_name', 
            'rol',
            'rol_nombre',
            'is_active',
            'is_staff',
            'date_joined',
            'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']
        extra_kwargs = {
            'password': {'write_only': True}  # Nunca mostrar password
        }

class ImagenReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenReporte
        fields = ['id', 'ruta_archivo', 'descripcion', 'fecha_subida']

class ReporteSerializer(serializers.ModelSerializer):
    imagenes = ImagenReporteSerializer(many=True, read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)
    estado_nombre = serializers.CharField(source='estado.nombre', read_only=True)
    
    class Meta:
        model = Reporte
        fields = '__all__'
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

class ComentarioSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)
    
    class Meta:
        model = Comentario
        fields = '__all__'
        read_only_fields = ['usuario', 'fecha_creacion', 'es_aprobado']