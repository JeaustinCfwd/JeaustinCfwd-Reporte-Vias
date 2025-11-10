from django.contrib import admin
from .models import Estado, Rol, Usuario, Reporte, ImagenReporte, Comentario

@admin.register(Estado)
class EstadoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre']

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'descripcion']

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'rol', 'date_joined']
    list_filter = ['rol', 'date_joined']

@admin.register(Reporte)
class ReporteAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'usuario', 'estado', 'categoria', 'fecha_creacion']
    list_filter = ['estado', 'categoria', 'fecha_creacion']
    search_fields = ['titulo', 'descripcion']

@admin.register(ImagenReporte)
class ImagenReporteAdmin(admin.ModelAdmin):
    list_display = ['reporte', 'descripcion', 'fecha_subida']

@admin.register(Comentario)
class ComentarioAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'calificacion', 'es_aprobado', 'fecha_creacion']
    list_filter = ['es_aprobado', 'calificacion']
    actions = ['aprobar_comentarios']
    
    def aprobar_comentarios(self, request, queryset):
        from django.utils import timezone
        queryset.update(es_aprobado=True, fecha_aprobacion=timezone.now())
    aprobar_comentarios.short_description = "Aprobar comentarios seleccionados"