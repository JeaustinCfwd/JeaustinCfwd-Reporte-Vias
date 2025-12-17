import React, { useState, useEffect } from 'react';
import { User, Lock, Settings, Trash2 } from 'lucide-react';
import { logout } from "../services/fetch.js";
import { deleteUser, updateUser } from '../services/fetch.js';
import { useNavigate } from 'react-router-dom';
import "../styles/Profile.css";

// Función para generar CSV con datos del usuario
const generateUserCSV = (userData) => {
    const headers = ['Campo', 'Valor'];
    const rows = [
        ['ID Usuario', userData.id || ''],
        ['Nombre de Usuario', userData.username || ''],
        ['Nombre', userData.first_name || ''],
        ['Apellido', userData.last_name || ''],
        ['Email', userData.email || ''],
        ['Teléfono', userData.phone || ''],
        ['Ubicación', userData.location || ''],
        ['Biografía', userData.bio || ''],
        ['Fecha de Nacimiento', userData.birth_date || ''],
        ['Género', userData.gender || ''],
        ['Rol', userData.rol || ''],
        ['Fecha de Registro', userData.date_joined || ''],
        ['Último Login', userData.last_login || ''],
        ['Preferencias', JSON.stringify(userData.preferences || '{}')]
    ];

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    return csvContent;
};

// Función para descargar el CSV
const downloadCSV = (csvContent, filename) => {
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const PFTabConfiguracion = ({ usuarioActual }) => {
 const navigate = useNavigate();
 const [loading, setLoading] = useState(false);
 const [user, setUser] = useState(null);
 const [preferences, setPreferences] = useState({
  notifications: true,
  darkMode: false,
  language: 'es',
  timezone: 'America/Mexico_City'
 });

 useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

    let userData = null;
    if (usuarioActual && usuarioActual.id) {
        userData = storedUser && storedUser.id === usuarioActual.id
            ? { ...usuarioActual, ...storedUser }
            : usuarioActual;
    } else {
        userData = storedUser;
    }
    
    if (userData) {
        setUser(userData);
        
        setPreferences(prevPreferences => ({
            ...prevPreferences,
            ...(userData.preferences || {})
        }));
    }
 }, [usuarioActual]);

 const handlePreferenceChange = async (key, value) => {
  const newPreferences = { ...preferences, [key]: value };
  setPreferences(newPreferences);

  if (user) {
   try {
    const updatedUser = await updateUser(user.id, { preferences: newPreferences });
    if (updatedUser) {
     localStorage.setItem('user', JSON.stringify(updatedUser));
    }
   } catch (error) {
    console.error('Error al actualizar preferencias:', error);
   }
  }
 };

 const handleDeleteAccount = async () => {
  // 1) Id preferido: el del objeto user en estado
  let userId = user?.id;

  // 2) Fallback: id_usuario almacenado en localStorage (se guarda al iniciar sesión)
  if (!userId) {
   const storedId = localStorage.getItem('id_usuario');
   if (storedId) {
    userId = parseInt(storedId, 10);
   }
  }

  if (!userId) {
   alert('No se encontró un usuario válido para eliminar. Inicia sesión nuevamente.');
   return;
  }

  if (!window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esto es permanente.')) {
   return;
  }

  setLoading(true);
  try {
   await deleteUser(userId);
   logout();
   alert('Cuenta eliminada exitosamente');
   navigate('/login');
  } catch (error) {
   alert('Error al eliminar cuenta: ' + error.message);
  }
  setLoading(false);
 };

 const handleDownloadData = () => {
    // Usar el estado 'user' que ahora tiene los datos completos de usuarioActual
    if (!user) {
        alert('No se encontró información del usuario para descargar.');
        return;
    }
    
    try {
        // Generar el CSV con los datos completos del usuario
        const csvContent = generateUserCSV(user);
        
        // Crear nombre de archivo con timestamp
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `datos_usuario_${user.username || 'user'}_${timestamp}.csv`;
        
        // Descargar el archivo
        downloadCSV(csvContent, filename);
        
        alert('Datos descargados exitosamente');
    } catch (error) {
        console.error('Error al descargar datos:', error);
        alert('Error al descargar los datos. Por favor, intenta nuevamente.');
    }
};

 return (
  <div className="profile-content">
   <h1 className="profile-title">Configuración de Cuenta</h1>
   <p className="profile-subtitle">Administra las opciones de tu cuenta</p>

   <div className="profile-form">
    {/* Preferencias */}
    <div className="form-section-divider">
     <h2 className="form-section-title">Preferencias</h2>
    </div>

    {/* Notificaciones */}
    <div className="form-row">
     <label className="form-label">
      Notificaciones
      <small className="form-hint">Recibe actualizaciones importantes</small>
     </label>
     <div className="form-field">
      <label className="checkbox-container">
       <input
        type="checkbox"
        checked={preferences.notifications}
        onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
        className="checkbox-input"
       />
       <span className="checkbox-label">Activar notificaciones</span>
      </label>
     </div>
    </div>

    {/* Modo Oscuro */}
    <div className="form-row">
     <label className="form-label">
      Modo Oscuro
      <small className="form-hint">Cambiar a modo oscuro para reducir fatiga visual</small>
     </label>
     <div className="form-field">
      <label className="checkbox-container">
       <input
        type="checkbox"
        checked={preferences.darkMode}
        onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
        className="checkbox-input"
       />
       <span className="checkbox-label">Activar modo oscuro</span>
      </label>
     </div>
    </div>

    {/* Idioma */}
    <div className="form-row">
     <label htmlFor="language" className="form-label">
      Idioma
      <small className="form-hint">Selecciona tu idioma preferido</small>
     </label>
     <div className="form-field">
      <select
       id="language"
       value={preferences.language}
       onChange={(e) => handlePreferenceChange('language', e.target.value)}
       className="form-input"
      >
       <option value="es">Español</option>
       <option value="en">Inglés</option>
       <option value="fr">Francés</option>
       <option value="de">Alemán</option>
      </select>
     </div>
    </div>

    {/* Zona Horaria */}
    <div className="form-row">
     <label htmlFor="timezone" className="form-label">
      Zona Horaria
      <small className="form-hint">Configura tu zona horaria</small>
     </label>
     <div className="form-field">
      <select
       id="timezone"
       value={preferences.timezone}
       onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
       className="form-input"
      >
       <option value="America/New_York">Estados Unidos (New York)</option>
       <option value="Europe/London">Reino Unido (Londres)</option>
       <option value="Europe/Madrid">España (Madrid)</option>
       <option value="America/Mexico_City">México (Ciudad de México)</option>
       <option value="Asia/Tokyo">Japón (Tokio)</option>
      </select>
     </div>
    </div>

    {/* Seguridad */}
    <div className="form-section-divider">
     <h2 className="form-section-title">Seguridad</h2>
    </div>

    {/* Autenticación de dos factores */}
    <div className="form-row">
     <label className="form-label">
      Autenticación de dos factores
      <small className="form-hint">Activar para mayor seguridad</small>
     </label>
     <div className="form-field">
      <button className="btn-secondary">
       Configurar
      </button>
     </div>
    </div>

    {/* Historial de inicio de sesión */}
    <div className="form-row">
     <label className="form-label">
      Historial de inicio de sesión
      <small className="form-hint">Ver tu actividad reciente</small>
     </label>
     <div className="form-field">
      <button className="btn-link">
       Ver historial
      </button>
     </div>
    </div>

    {/* Exportar Datos */}
    <div className="form-section-divider">
     <h2 className="form-section-title">Exportar Datos</h2>
    </div>

    {/* Exportar datos de cuenta */}
    <div className="form-row">
     <label className="form-label">
      Exportar datos de cuenta
      <small className="form-hint">Descarga tu información personal</small>
     </label>
     <div className="form-field">
      <button
       className="btn-secondary"
       onClick={handleDownloadData}
      >
       Descargar
      </button>
     </div>
    </div>

    {/* Zona Peligrosa */}
    <div className="form-section-divider">
     <h2 className="form-section-title">Zona Peligrosa</h2>
    </div>

    <div className="danger-zone">
     <div>
      <h4 className="danger-zone-title">Eliminar Cuenta</h4>
      <p className="danger-zone-description">
       Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, está seguro.
      </p>
     </div>
     <button
      onClick={handleDeleteAccount}
      className="btn-danger"
      disabled={loading}
     >
      <Trash2 size={18} />
      {loading ? 'Eliminando...' : 'Eliminar Cuenta'}
     </button>
    </div>
   </div>
  </div>
 );
};
