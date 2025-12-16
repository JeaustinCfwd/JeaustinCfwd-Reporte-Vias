from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from api.models import Reporte, Estado  # Ajusta "api" al nombre real de tu aplicación

User = get_user_model()


class ReporteAPITestCase(APITestCase):

    def setUp(self):
        # Crear usuario y estado de prueba
        self.usuario = User.objects.create_user(username="tester", password="12345")
        self.estado = Estado.objects.create(nombre="Pendiente")

        # URL de creación de reporte
        self.url = reverse("crear-reporte")

        # Datos base para crear un reporte
        self.data = {
            "usuario": self.usuario.id,
            "estado": self.estado.id,
            "titulo": "Reporte de prueba",
            "descripcion": "Descripción del reporte de prueba",
            "latitud": "9.933333",
            "longitud": "-84.083333",
            "categoria": "Baches",
            "aprobado": False,
        }

    def test_crear_reporte(self):
        """Probar creación de un reporte vía API"""
        response = self.client.post(self.url, self.data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Reporte.objects.count(), 1)
        self.assertEqual(Reporte.objects.first().titulo, "Reporte de prueba")

    def test_listar_reportes(self):
        """Probar listado de reportes vía API"""
        # Crear un reporte primero
        Reporte.objects.create(
            usuario=self.usuario,
            estado=self.estado,
            titulo="Reporte listado",
            descripcion="Descripción listado",
            latitud=9.933333,
            longitud=-84.083333,
            categoria="Señalización",
        )

        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["titulo"], "Reporte listado")

    def test_serializer_incluye_campos_extra(self):
        """Probar que el serializer incluye usuario_nombre y estado_nombre"""
        Reporte.objects.create(
            usuario=self.usuario,
            estado=self.estado,
            titulo="Serializer test",
            descripcion="Probando serializer",
            latitud=9.933333,
            longitud=-84.083333,
            categoria="Baches",
        )
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("usuario_nombre", response.data["results"][0])
        self.assertIn("estado_nombre", response.data["results"][0])
        self.assertEqual(response.data["results"][0]["usuario_nombre"], "tester")
        self.assertEqual(response.data["results"][0]["estado_nombre"], "Pendiente")
