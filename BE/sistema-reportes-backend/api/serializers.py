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
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password', 'rol', 'fecha_registro', 'foto_perfil']
        read_only_fields = ['fecha_registro']
    
    def create(self, validated_data):
        user = Usuario.objects.create_user(**validated_data)
        return user

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
        read_only_fields = ['usuario', 'fecha_creacion', 'fecha_actualizacion']

class ComentarioSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)
    
    class Meta:
        model = Comentario
        fields = '__all__'
        read_only_fields = ['usuario', 'fecha_creacion', 'es_aprobado']