import React, { useState, useEffect } from 'react';
import PFFoto from './PFFoto';
import PFCampo from './PFCampo';
import { usePFFormulario } from './PFFormulario';
import "../styles/Profile.css";

export const PFTabPerfil = ({ usuarioActual }) => {

 const {
  user,
  formData,
  photoPreview,
  loading,
  error,
  success,
  handleInputChange,
  handlePhotoChange,
  handleRemovePhoto,
  handleSubmit
 } = usePFFormulario(usuarioActual);

 const genderOptions = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'other', label: 'Otro' },
  { value: 'prefer-not-say', label: 'Prefiero no decir' }
 ];

 const [usuario, setUsuario] = useState({});

 useEffect(() => {
  const traerUsuario = async () => {
   try {
    const peticion = await fetch(`http://localhost:8000/api/usuario/${localStorage.getItem('id_usuario')}`, {
     method: 'GET',
     headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
     },
     credentials: 'include'
    });

    if (!peticion.ok) {
     const errorData = await peticion.json();
     console.error("Error de autenticación:", errorData);
     return;
    }
    
    const data = await peticion.json();

    if (data && data.id) {
     setUsuario(data);
    } else {
     console.error("No se encontraron datos de usuario:", data);
    }
   } catch (error) {
    console.error("Error al traer los datos del usuario:", error);
   }
  };

  traerUsuario();
 }, []);

 return (
  <div className="profile-content">
   <h1 className="profile-title">Editar Perfil</h1>
   <p className="profile-subtitle">Actualiza tu información personal</p>

   <form onSubmit={handleSubmit} className="profile-form">
    {error && <div className="alert alert-error">{error}</div>}
    {success && <div className="alert alert-success">{success}</div>}

    {/* Foto de Perfil */}
    <PFFoto
     photoPreview={photoPreview}
     onPhotoChange={handlePhotoChange}
     onRemovePhoto={handleRemovePhoto}
    />

    <div className="form-section-divider">
     <h2 className="form-section-title">Información Personal</h2>
    </div>

    {/* Nombre */}
    <PFCampo
     label="Nombre"
     name="username"
     value={formData.username || usuario.username || ""}
     onChange={handleInputChange}
     required
     sideBySide
     displayValue={usuarioActual?.username || user?.name || 'No disponible'}
    />

    {/* Email */}
    <PFCampo
     label="Email"
     type="email"
     name="email"
     value={formData.email || usuario.email || ""}
     onChange={handleInputChange}
     required
     sideBySide
     displayValue={usuarioActual?.email || user?.email || 'No disponible'}
    />

    <div className="form-section-divider">
     <h2 className="form-section-title">Información Adicional</h2>
    </div>

    {/* Biografía */}
    <PFCampo
     label="Biografía"
     type="textarea"
     name="bio"
     value={formData.bio || usuario.bio || ""}
     onChange={handleInputChange}
     rows={4}
     placeholder="Cuéntanos sobre ti..."
    />

    {/* Teléfono */}
    <PFCampo
     label="Teléfono"
     type="tel"
     name="phone"
     value={formData.phone || usuario.phone || ""}
     onChange={handleInputChange}
     placeholder="+1234567890"
    />

    {/* Ubicación */}
    <PFCampo
     label="Ubicación"
     name="location"
     value={formData.location || usuario.location || ""}
     onChange={handleInputChange}
     placeholder="Ciudad, País"
    />

    {/* Fecha de Nacimiento */}
    <PFCampo
     label="Fecha de Nacimiento"
     type="date"
     name="birth_date"
     value={formData.birth_date || usuario.birth_date || ""}
     onChange={handleInputChange}
    />

    {/* Género */}
    <PFCampo
     label="Género"
     type="select"
     name="gender"
     value={formData.gender || usuario.gender || ""}
     onChange={handleInputChange}
     options={genderOptions}
    />

    <div className="form-actions">
     <button type="submit" className="btn-primary" disabled={loading}>
      {loading ? 'Guardando...' : 'Guardar Cambios'}
     </button>
    </div>
   </form>
  </div>
 );
};
