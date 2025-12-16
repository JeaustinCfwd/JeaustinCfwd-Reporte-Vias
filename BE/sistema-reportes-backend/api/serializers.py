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
    imagen_perfil = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = Usuario
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'rol',
            'is_active',
            'is_staff',
            'date_joined',
            'last_login',
            'preferences',
            'imagen_perfil',
            'bio',
            'phone',
            'location',
            'birth_date',
            'gender'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def update(self, instance, validated_data):
        # Manejar la eliminación de imagen_perfil
        imagen_perfil = validated_data.get('imagen_perfil')
        if imagen_perfil is None and 'imagen_perfil' in validated_data:
            # Si imagen_perfil se establece explícitamente en None, eliminar la imagen anterior
            if instance.imagen_perfil:
                # TODO: Agregar lógica para eliminar imagen de Cloudinary si es necesario
                # Por ahora, solo establecer el campo en null
                pass
        
        return super().update(instance, validated_data)


class ImagenReporteSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = ImagenReporte
        fields = ['id', 'reporte', 'ruta_archivo',
                  'url', 'descripcion', 'fecha_subida']

    def get_url(self, obj):
        if obj.ruta_archivo:
            return obj.ruta_archivo.url
        return None


class ReporteSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(
        source='usuario.username', read_only=True)
    estado_nombre = serializers.CharField(
        source='estado.nombre', read_only=True)

    class Meta:
        model = Reporte
        fields = '__all__'
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion', 'estado']  # ✅ estado es read_only
        extra_kwargs = {
            'estado': {'required': False}  # ✅ estado NO es requerido
        }

    def get_url_imagen_url(self, obj):
        if obj.url_imagen:
            return obj.url_imagen.url
        return None


class ComentarioSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(
        source='usuario.username', read_only=True)

    class Meta:
        model = Comentario
        fields = '__all__'

# --- INICIO DEL SERIALIZADOR DE REGISTRO ---


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={
                                     'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={
                                      'input_type': 'password'})

    class Meta:
        model = Usuario
        # Campos que React enviará para crear la cuenta
        fields = ['username', 'email', 'password',
                  'password2', 'first_name', 'last_name', 'rol']
        extra_kwargs = {
            # Corregido: eliminado el '+' extra
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }

    def validate(self, data):  # Corregido: Añadidos los dos puntos (:) al final de la línea
        # 1. Valida que las dos contraseñas coincidan
        if data['password'] != data['password2']:
            # Corregido: añadido punto final por consistencia
            raise serializers.ValidationError(
                {"password": "Las contraseñas no coinciden."})

        # 2. Valida que el email sea único
        if Usuario.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError(
                {"email": "Este email ya está registrado."})

        return data

    def create(self, validated_data):
        # Elimina password2 porque no se guarda en la DB
        validated_data.pop('password2')

        # Usa create_user para hashear la contraseña correctamente
        user = Usuario.objects.create_user(**validated_data)

        return user