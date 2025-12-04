import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// ==========================
// Cambiar centro del mapa
// ==========================
export function ChangeMapView({ center, zoom }) {
 const map = useMap();
 useEffect(() => {
  map.setView(center, zoom);
 }, [center, zoom, map]);
 return null;
}

// ==========================
// Click en el mapa
// ==========================
export function MapClickHandler({ onLocationChange }) {
 const map = useMap();

 useEffect(() => {
  const handleClick = (e) => {
   const { latitud, longitud } = e.latlng;
   onLocationChange({ latitud, longitud });
  };

  map.on('click', handleClick);
  return () => map.off('click', handleClick);
 }, [map, onLocationChange]);

 return null;
}

// ==========================
// Marcador Leaflet Default
// ==========================
export const setupLeafletIcons = () => {
 delete L.Icon.Default.prototype._getIconUrl;
 L.Icon.Default.mergeOptions({
  iconRetinaUrl:
   'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
   'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
   'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
 });
};
