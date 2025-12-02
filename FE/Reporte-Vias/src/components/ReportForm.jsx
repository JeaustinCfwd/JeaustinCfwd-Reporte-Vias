import React, { useState, useEffect } from 'react'; 
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPinHouse  , Cctv } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import gsap from 'gsap';
import '../styles/ReportForm.css';
import Prism from './PrismOGL';

// ==========================
// AUX: Cambiar centro del mapa
// ==========================
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// ==========================
// AUX: Click en el mapa
// ==========================
function MapClickHandler({ onLocationChange }) {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e) => {
      const { lat, lng } = e.latlng;
      onLocationChange({ lat, lng });
    };

    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [map, onLocationChange]);

  return null;
}

// ==========================
// Marcador Leaflet Default
// ==========================
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ==========================
// COMPONENTE PRINCIPAL
// ==========================
const ReportForm = () => {
  const { success, error: showError, warning } = useToast();

  const [formData, setFormData] = useState({
    photos: [],
    description: '',
    category: '',
    location: { lat: 9.7489, lng: -83.7534 }, // Centro de Costa Rica
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const categories = [
    { value: 'bache', label: 'Bache' },
    { value: 'semaforo_danado', label: 'Semáforo dañado' },
    { value: 'senalizacion_deficiente', label: 'Señalización deficiente' },
    { value: 'alcantarilla_danada', label: 'Alcantarilla dañada' },
    { value: 'iluminacion_deficiente', label: 'Iluminación deficiente' },
    { value: 'inundacion', label: 'Inundación' },
    { value: 'derrumbe', label: 'Derrumbe' },
    { value: 'arbol_caido', label: 'Árbol Caído' },
    { value: 'hundimiento_calzada', label: 'Hundimiento de Calzada' },
    { value: 'fuga_agua', label: 'Fuga de Agua' },
    { value: 'cableado_caido', label: 'Cableado Caído' },
    { value: 'obstruccion_via', label: 'Obstrucción de Vía' },
    { value: 'otro', label: 'Otro' },
  ];

  // ==========================
  // Animación del botón TRUCK
  // ==========================
  useEffect(() => {
    const button = document.querySelector('.truck-button');
    if (!button) return;

    const handleClick = () => {
      const box = button.querySelector('.box');
      const truck = button.querySelector('.truck');

      if (!button.classList.contains('done')) {
        if (!button.classList.contains('animation')) {
          button.classList.add('animation');

          gsap.to(button, { '--box-s': 1, '--box-o': 1, duration: 0.3, delay: 0.5 });
          gsap.to(box, { x: 0, duration: 0.4, delay: 0.7 });
          gsap.to(button, { '--hx': -5, '--bx': 50, duration: 0.18, delay: 0.92 });
          gsap.to(box, { y: 0, duration: 0.1, delay: 1.15 });

          gsap.set(button, { '--truck-y': 0, '--truck-y-n': -26 });

          gsap.to(button, {
            '--truck-y': 1,
            '--truck-y-n': -25,
            duration: 0.2,
            delay: 1.25,
            onComplete() {
              gsap
                .timeline({
                  onComplete() {
                    button.classList.add('done');
                  },
                })
                .to(truck, { x: 0, duration: 0.4 })
                .to(truck, { x: 40, duration: 1 })
                .to(truck, { x: 20, duration: 0.6 })
                .to(truck, { x: 96, duration: 0.4 });

              gsap.to(button, {
                '--progress': 1,
                duration: 2.4,
                ease: 'power2.in',
              });
            },
          });
        }
      } else {
        button.classList.remove('animation', 'done');

        gsap.set(truck, { x: 4 });
        gsap.set(button, {
          '--progress': 0,
          '--hx': 0,
          '--bx': 0,
          '--box-s': 0.5,
          '--box-o': 0,
          '--truck-y': 0,
          '--truck-y-n': -26,
        });

        gsap.set(box, { x: -24, y: -6 });
      }
    };

    button.addEventListener('click', handleClick);
    return () => button.removeEventListener('click', handleClick);
  }, []);

  // ==========================
  // Manejo de imágenes
  // ==========================
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith('image/')
    );
    setSelectedFiles(files);
    setFormData((prev) => ({ ...prev, photos: files }));
  };

  // ==========================
  // Inputs generales
  // ==========================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ==========================
  // Inputs Lat / Lng
  // ==========================
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: parseFloat(value) || prev.location[name],
      },
    }));
  };

  // ==========================
  // Búsqueda de dirección
  // ==========================
  const handleAddressSearch = async () => {
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
      setFormData((prev) => ({
        ...prev,
        location: { lat: parseFloat(lat), lng: parseFloat(lon) },
      }));
    } catch (error) {
      setSearchError(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  // ==========================
  // Convertir imágenes a Base64
  // ==========================
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // ==========================
  // SUBMIT DEL REPORTE
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    const userId = localStorage.getItem('id_usuario');
    if (!userId) {
      showError('Inicia sesión de nuevo, usuario no encontrado.');
      return;
    }

    if (!formData.category) {
      showError('Debes seleccionar una categoría.');
      return;
    }

    if (!formData.description.trim()) {
      showError('La descripción no puede estar vacía.');
      return;
    }

    // Base64 conversion
    const photos = [];
    for (const file of selectedFiles) {
      try {
        photos.push(await convertToBase64(file));
      } catch {
        showError('Error al procesar las imágenes');
        return;
      }
    }

    const report = {
      titulo:
        formData.category.charAt(0).toUpperCase() +
        formData.category.slice(1).replace(/_/g, ' '),
      descripcion: formData.description,
      latitud: formData.location.lat,
      longitud: formData.location.lng,
      estado: 1,
      usuario: parseInt(userId),
      categoria: formData.category,
      ...(photos.length > 0 && { fotos: photos }),
    };

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:8000/api/crear-reporte/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(report),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(JSON.stringify(data));
      }

      success('¡Reporte enviado exitosamente!');
      setSubmitSuccess(true);

      // Reset
      setFormData({
        photos: [],
        description: '',
        category: '',
        location: { lat: 9.7489, lng: -83.7534 },
      });
      setSelectedFiles([]);
    } catch (err) {
      setSubmitError(err.message);
      showError('Error al enviar el reporte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================
  // JSX
  // ==========================
  return (
    <>
      {/* Fondo Animado */}
      <div className="prism-background">
        <Prism
          animationType="hover"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>

      <div className="report-form-container">
        <h1 className="report-title">Reportar Problema Vial</h1>
        <p className="report-subtitle">
          Ayúdanos a mejorar la infraestructura de tu ciudad
        </p>

        <form onSubmit={handleSubmit} className="report-form">

          {/* === Fotos === */}
          <section className="form-section">
            <h2 className="section-title">
              <Cctv className="section-icon" /> Fotos del Problema
            </h2>

            <div className="file-upload">
              <input
                type="file"
                id="photos"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />

              <label htmlFor="photos" className="file-label">
                Haz clic para subir fotos o arrastra aquí
              </label>

              {selectedFiles.length > 0 && (
                <p className="file-count">
                  {selectedFiles.length} foto(s) seleccionada(s)
                </p>
              )}
            </div>
          </section>

          {/* === Descripción === */}
          <section className="form-section">
            <h2 className="section-title">Descripción del Problema</h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe el problema vial..."
              rows={4}
              className="textarea-input"
              required
            ></textarea>
          </section>

          {/* === Categorías === */}
          <section className="form-section">
            <h2 className="section-title">Categoría</h2>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="select-input"
              required
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </section>

          {/* === UBICACIÓN === */}
          <section className="form-section">
            <h2 className="section-title">
              <MapPinHouse  className="section-icon" /> Ubicación
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
                center={[formData.location.lat, formData.location.lng]}
                zoom={7}
                minZoom={6}
                maxZoom={18}
                maxBounds={[
                  [8.0, -86.0],
                  [11.5, -82.5],
                ]}
                maxBoundsViscosity={1.0}
                style={{ height: '600px', width: '100%' }}
                className="leaflet-map"
              >
                <ChangeMapView
                  center={[formData.location.lat, formData.location.lng]}
                  zoom={7}
                />

                <MapClickHandler
                  onLocationChange={(loc) => {
                    if (
                      loc.lat >= 8.0 &&
                      loc.lat <= 11.5 &&
                      loc.lng >= -86.0 &&
                      loc.lng <= -82.5
                    ) {
                      setFormData((prev) => ({ ...prev, location: loc }));
                    } else {
                      warning('Solo puedes marcar ubicaciones dentro de Costa Rica');
                    }
                  }}
                />

                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker
                  position={[formData.location.lat, formData.location.lng]}
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
                        setFormData((prev) => ({
                          ...prev,
                          location: newPos,
                        }));
                      } else {
                        warning(
                          'Solo puedes marcar ubicaciones dentro de Costa Rica'
                        );
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
                value={formData.location.lat}
                onChange={handleLocationChange}
                step="any"
                className="location-input"
              />
              <input
                type="number"
                name="lng"
                value={formData.location.lng}
                onChange={handleLocationChange}
                step="any"
                className="location-input"
              />
            </div>
          </section>

          {/* BOTÓN SUBMIT ANIMADO */}
          <button type="submit" className="truck-button" disabled={isSubmitting}>
            <span className="default">Enviar Reporte</span>

            <span className="success">
              Reporte Enviado
              <svg viewBox="0 0 12 10">
                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
              </svg>
            </span>

            <div className="truck">
              <div className="wheel"></div>
              <div className="back"></div>
              <div className="front"></div>
              <div className="box"></div>
            </div>
          </button>
        </form>

        {submitSuccess && <p className="success-message">Reporte enviado exitosamente!</p>}
        {submitError && <p className="error-message">Error: {submitError}</p>}
      </div>
    </>
  );
};

export default ReportForm;
