from django.db import models
from cloudinary.models import CloudinaryField

from django.contrib.auth.models import AbstractUser


# 1. Modelo Estado
class Estado(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'estado'
        verbose_name_plural = 'Estados'

    def __str__(self):
        return self.nombre


# 2. Modelo Rol
class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'rol'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return self.nombre


# 3. Modelo Usuario
class Usuario(AbstractUser):
    ROL_OPCIONES = (
     ("admin", "Administrador"),
     ("usuario", "Usuario"),
    )
    rol = models.CharField(max_length=50, choices=ROL_OPCIONES, default="usuario")
    imagen_perfil = models.TextField(null=True,blank=True)
    class Meta:
        db_table = 'usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.username


# 4. Modelo Reporte         
class Reporte(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='reportes')
    estado = models.ForeignKey(Estado, on_delete=models.RESTRICT, related_name='reportes')
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    latitud = models.DecimalField(max_digits=9, decimal_places=6)
    longitud = models.DecimalField(max_digits=9, decimal_places=6)
    categoria = models.CharField(max_length=50)  # Baches, Señalización, etc.
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    aprobado = models.BooleanField(default=False)
    url_imagen = CloudinaryField('image', blank=True, null=True)

    class Meta:
        db_table = 'reporte'
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"{self.titulo} - {self.estado.nombre}"


# 5. Modelo ImagenReporte
class ImagenReporte(models.Model):
    reporte = models.ForeignKey(Reporte, on_delete=models.CASCADE, related_name='imagenes')
    ruta_archivo = CloudinaryField('image')
    descripcion = models.CharField(max_length=255, blank=True)
    fecha_subida = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'imagen_reporte'

    def __str__(self):
        return f"Imagen de {self.reporte.titulo}"

# 6. Modelo Comentario
class Comentario(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='comentarios')
    contenido = models.TextField()
    calificacion = models.IntegerField()  # 1-5
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'comentario'
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"Comentario de {self.usuario.username}"