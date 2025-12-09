import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { obtenerDatosEstadisticos } from '@/services/fetch';

// Configuración de Leaflet (puedes mover esto a un archivo separado si lo usas en otros lados)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color};"></div>`,
    iconSize: [24, 24], // Tamaño del icono completo
    iconAnchor: [12, 12], // Punto de anclaje (centro)
    popupAnchor: [0, -12] // Donde aparece el popup relativo al icono
  });
};

const stateIcons = {
  // Mapeo por string (legacy)
  nuevo: createCustomIcon('#FC8181'),
  en_revision: createCustomIcon('#5A67D8'),
  atendido: createCustomIcon('#48BB78'),

  // Mapeo por ID (según API: 1=Nuevo, 2=En Revisión, 3=Atendido)
  1: createCustomIcon('#FC8181'),
  2: createCustomIcon('#5A67D8'),
  3: createCustomIcon('#48BB78'),
};

const DBVistaMapa = ({ filteredReports, statsByState }) => {
  // Filtrar reportes con coordenadas válidas
  const validReports = filteredReports.filter(report =>
    report.latitud && report.longitud &&
    report.latitud >= 8.0 && report.latitud <= 11.5 &&
    report.longitud >= -86.0 && report.longitud <= -82.5
  );
  const [cantidadNuevos, setCantidadNuevos] = useState(0)
  const [cantidadRevisiones, setCantidadRevisiones] = useState(0)
  const [cantidadAtendidos, setCantidadAtendidos] = useState(0)

  useEffect(() => {
    const traerDatos = async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/crear-reporte/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const datos = await response.json()

      console.log(datos);

      const filtroCantidadNuevos = datos.results.filter((dato) => dato.estado == 1)
      const filtroCantidadRevisiones = datos.results.filter((dato) => dato.estado == 2)
      const filtroCantidadAtendidos = datos.results.filter((dato) => dato.estado == 3)
      setCantidadNuevos(filtroCantidadNuevos.length)
      setCantidadRevisiones(filtroCantidadRevisiones.length)
      setCantidadAtendidos(filtroCantidadAtendidos.length)
    }
    traerDatos()
  }, [])


  return (
    <div className="map-content">
      <div className="map-legend">
        <h3>Leyenda</h3>
        <div className="legend-item">
          <span className="legend-marker nuevo"></span>
          <span>Nuevos ({cantidadNuevos})</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker revision"></span>
          <span>En Revisión ({cantidadRevisiones})</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker atendido"></span>
          <span>Atendidos ({cantidadAtendidos})</span>
        </div>
      </div>

      <div className="map-container-wrapper">
        <MapContainer
          center={[9.7489, -83.7534]}
          zoom={7}
          minZoom={6}
          maxZoom={18}
          maxBounds={[[8.0, -86.0], [11.5, -82.5]]}
          maxBoundsViscosity={1.0}
          className="leaflet-map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {validReports.map(report => (
            <Marker

              key={report.id}
              position={[parseFloat(report.latitud), parseFloat(report.longitud)]}
              icon={stateIcons[report.estado] || stateIcons[report.state] || stateIcons.nuevo}

            >
              <Popup>
                <strong>{report.title || report.titulo || 'Sin título'}</strong><br />
                {report.description || report.descripcion || 'Sin descripción'}<br />
                Estado: {report.estado_nombre || report.state?.replace(/_/g, ' ') || 'Desconocido'}<br />
                Categoría: {report.category?.replace(/_/g, ' ') || report.categoria || 'Sin categoría'}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {validReports.length === 0 && (
          <div className="no-reports-overlay">
            <div className="no-reports-message">
              <h4>No hay reportes con coordenadas válidas</h4>
              <p>Los reportes deben tener latitud y longitud para mostrarse en el mapa.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DBVistaMapa;