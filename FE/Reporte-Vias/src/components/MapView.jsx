import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
    html: `<div class="map-marker" style="background-color: ${color};"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });
};

const stateIcons = {
  nuevo: createCustomIcon('#FC8181'),
  en_revision: createCustomIcon('#5A67D8'),
  atendido: createCustomIcon('#48BB78')
};

const MapView = ({ filteredReports, statsByState }) => {
  return (
    <div className="map-content">
      <div className="map-legend">
        <h3>Leyenda</h3>
        <div className="legend-item">
          <span className="legend-marker nuevo"></span>
          <span>Nuevos ({statsByState.nuevo || 0})</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker revision"></span>
          <span>En Revisión ({statsByState.en_revision || 0})</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker atendido"></span>
          <span>Atendidos ({statsByState.atendido || 0})</span>
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
          style={{ height: '500px', width: '100%' }}
          className="leaflet-map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredReports
            .filter(report =>
              report.latitud >= 8.0 && report.latitud <= 11.5 &&
              report.longitud >= -86.0 && report.longitud <= -82.5
            )
            .map(report => (
              <Marker
                key={report.id}
                position={[report.latitud, report.longitud]}
                icon={stateIcons[report.state] || stateIcons.nuevo}
              >
                <Popup>
                  <strong>{report.title}</strong><br />
                  {report.description}<br />
                  Estado: {report.state?.replace(/_/g, ' ')}<br />
                  Categoría: {report.category?.replace(/_/g, ' ')}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;