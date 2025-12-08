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
        fields = '__all__'

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
        
# --- INICIO DEL SERIALIZADOR DE REGISTRO ---
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = Usuario
        # Campos que React enviará para crear la cuenta
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'rol']
        extra_kwargs = {
              'first_name': {'required': True}, # Corregido: eliminado el '+' extra
              'last_name': {'required': True},
              'email': {'required': True}
        }
    
    def validate(self, data): # Corregido: Añadidos los dos puntos (:) al final de la línea
        # 1. Valida que las dos contraseñas coincidan
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."}) # Corregido: añadido punto final por consistencia

        # 2. Valida que el email sea único
        if Usuario.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email":"Este email ya está registrado."})
    
        return data
      
    def create(self, validated_data):
        # Elimina password2 porque no se guarda en la DB
        validated_data.pop('password2')
        
        # Usa create_user para hashear la contraseña correctamente
        user = Usuario.objects.create_user(**validated_data)
        
        return user
