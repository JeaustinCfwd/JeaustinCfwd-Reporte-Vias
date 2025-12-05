import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { MapPinHouse } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { ChangeMapView, MapClickHandler, setupLeafletIcons } from './RPUtilidadesMapa';
import { COSTA_RICA_BOUNDS, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from './RPConstantes';

// Configurar íconos de Leaflet
setupLeafletIcons();

const RPUbicacion = ({ location, onLocationChange }) => {
 const { warning } = useToast();
 const [addressSearch, setAddressSearch] = useState('');
 const [isSearching, setIsSearching] = useState(false);
 const [searchError, setSearchError] = useState('');

 const handleLocationChange = (e) => {
  const { name, value } = e.target;
  onLocationChange({
   ...location,
   [name]: parseFloat(value) || location[name],
  });
 };

 const handleAddressSearch = async () => {
    console.log('Botón Buscar ejecutado');
  if (!addressSearch.trim()) {
   setSearchError('Por favor ingresa una dirección');
   return;
  }

  setIsSearching(true);
  setSearchError('');

  try {
   const query = encodeURIComponent(`${addressSearch}, Costa Rica`);
   const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=cr&limit=5`,
    {
     headers: { 'User-Agent': 'ReporteViasCR/1.0' },
    }
   );

   if (!response.ok) throw new Error('Error al buscar la dirección');

   const data = await response.json();

   if (data.length === 0) {
    setSearchError(
     'No se encontró la dirección. Intenta buscar: "Desamparados", "La Capri" o el cantón/distrito más cercano.'
    );
    return;
   }

   const { lat, lon } = data[0];

   onLocationChange({
    latitud: parseFloat(lat),
    longitud: parseFloat(lon),
   });
  } catch (error) {
   setSearchError(error.message);
  } finally {
   setIsSearching(false);
  }
 };

 return (
  <section className="form-section">
   <h2 className="section-title">
    <MapPinHouse className="section-icon" /> Ubicación
   </h2>

   {/* Búsqueda */}
   <div className="address-search-container">
    <input
     type="text"
     placeholder="Ej: La Capri, Desamparados"
     onChange={(e) => setAddressSearch(e.target.value)}
     onKeyPress={(e) =>
      e.key === 'Enter' && (e.preventDefault(), handleAddressSearch())
     }
     className="address-search-input"
    />

    <button
     type="button"
     onClick={handleAddressSearch}
     disabled={isSearching}
     className="address-search-button"
    >
     <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
     <span></span>
    </button>

    {searchError && <p className="search-error">{searchError}</p>}
   </div>

   {/* MAPA */}
   <div className="map-container">
    <MapContainer
     center={[location.latitud, location.longitud]}
     zoom={DEFAULT_ZOOM}
     minZoom={MIN_ZOOM}
     maxZoom={MAX_ZOOM}
     maxBounds={COSTA_RICA_BOUNDS}
     maxBoundsViscosity={1.0}
     style={{ height: '600px', width: '100%' }}
     className="leaflet-map"
    >
     <ChangeMapView
      center={[location.latitud, location.longitud]}
      zoom={DEFAULT_ZOOM}
     />

     <MapClickHandler
      onLocationChange={(loc) => {
       if (
        loc.latitud >= 8.0 &&
        loc.latitud <= 11.5 &&
        loc.longitud >= -86.0 &&
        loc.longitud <= -82.5
       ) {
        onLocationChange(loc);
       } else {
        warning('Solo puedes marcar ubicaciones dentro de Costa Rica');
       }
      }}
     />

     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

     <Marker
      position={[location.latitud, location.longitud]}
      draggable={true}
      eventHandlers={{
       dragend: (e) => {
        const newPos = e.target.getLatLng();
        if (
         newPos.lat >= 8.0 &&
         newPos.lat <= 11.5 &&
         newPos.lng >= -86.0 &&
         newPos.lng <= -82.5
        ) {
         onLocationChange({ latitud: newPos.lat, longitud: newPos.lng });
        } else {
         warning('Solo puedes marcar ubicaciones dentro de Costa Rica');
        }
       },
      }}
     />
    </MapContainer>
   </div>

   {/* Inputs Lat/Lng */}
   <div className="location-inputs">
    <input
     type="number"
     name="lat"
     value={location.latitud}
     onChange={handleLocationChange}
     step="any"
     className="location-input"
    />
    <input
     type="number"
     name="lng"
     value={location.longitud}
     onChange={handleLocationChange}
     step="any"
     className="location-input"
    />
   </div>
  </section>
 );
};

export default RPUbicacion;
