import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import '../styles/ReportForm.css';
import Prism from './PrismOGL';
import RPFotos from './RPFotos';
import RPDescripcion from './RPDescripcion';
import RPCategoria from './RPCategoria';
import RPUbicacion from './RPUbicacion';
import RPBoton from './RPBoton';
import { INITIAL_LOCATION } from './RPConstantes';

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
  location: INITIAL_LOCATION,
 });

 const [selectedFiles, setSelectedFiles] = useState([]);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [submitSuccess, setSubmitSuccess] = useState(false);
 const [submitError, setSubmitError] = useState('');



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
   latitud: parseFloat(formData.location.latitud.toFixed(6)),
   longitud: parseFloat(formData.location.longitud.toFixed(6)),
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
    location: INITIAL_LOCATION,
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
     <RPFotos onFileChange={handleFileChange} selectedFiles={selectedFiles} />
     <RPDescripcion value={formData.description} onChange={handleInputChange} />
     <RPCategoria value={formData.category} onChange={handleInputChange} />
     <RPUbicacion location={formData.location} onLocationChange={(loc) => setFormData((prev) => ({ ...prev, location: loc }))} />
     <RPBoton isSubmitting={isSubmitting} />
    </form>

    {submitSuccess && <p className="success-message">Reporte enviado exitosamente!</p>}
    {submitError && <p className="error-message">Error: {submitError}</p>}
   </div>
  </>
 );
};

export default ReportForm;
