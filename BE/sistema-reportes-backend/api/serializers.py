from rest_framework import serializers
from .models import Estado, Rol, Usuario, Reporte, ImagenReporte, Comentario


class EstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado
        fields = '__all__'