import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Camera, Trash2, LogOut, Settings, Shield, Eye, EyeOff } from 'lucide-react';
import { updateUser, deleteUser, getUserPhoto } from '../services/fetch.js';
import "../styles/Profile.css";

const ProfileEdit = ({ usuarioActual }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        name: storedUser.name || '',
        email: storedUser.email || '',
        password: '',
        confirmPassword: ''
      });
      const userPhoto = getUserPhoto(storedUser.id);
      setPhotoPreview(userPhoto || '');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    if (!user) return;

    setLoading(true);
    const updateData = {
      name: formData.name,
      email: formData.email,
      ...(formData.password && { password: formData.password }),
      photo: photoPreview
    };

    try {
      const updatedUser = await updateUser(user.id, updateData);
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert('Perfil actualizado exitosamente');
      } else {
        alert('Error al actualizar perfil');
      }
    } catch (error) {
      alert('Error al actualizar: ' + error.message);
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!user || !window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esto es permanente.')) return;

    setLoading(true);
    try {
      await deleteUser(user.id);
      localStorage.removeItem('user');
      alert('Cuenta eliminada exitosamente');
      navigate('/login');
    } catch (error) {
      alert('Error al eliminar cuenta: ' + error.message);
    }
    setLoading(false);
  };

  if (!user) return <div className="profile-loading">Cargando...</div>;

  return (
    <div className="profile-content">
      <h1 className="profile-title">Editar Perfil</h1>
      <p className="profile-subtitle">Actualiza tu información personal</p>

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Foto de Perfil */}
        <div className="form-row">
          <label className="form-label">Foto de Perfil</label>
          <div className="form-field">
            <div className="profile-photo-container">
              <div className="profile-photo-wrapper">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="profile-photo" />
                ) : (
                  <div className="profile-photo-placeholder">
                    <User size={40} />
                  </div>
                )}
              </div>
              <div className="photo-actions">
                <label htmlFor="photo" className="photo-upload-btn">
                  <Camera size={18} />
                  {photoPreview ? 'Cambiar foto' : 'Subir foto'}
                </label>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => setPhotoPreview('')}
                    className="photo-remove-btn"
                  >
                    Eliminar foto
                  </button>
                )}
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="photo-input-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nombre - Lado a lado */}
        <div className="form-row form-row-side-by-side">
          {/* Datos Actuales (izquierda) */}
          <div className="form-field form-field-display">
            <label className="form-label">Nombre Actual</label>
            <div className="display-value">
              {usuarioActual?.username || 'No disponible'}
            </div>
          </div>

          {/* Input de Edición (derecha) */}
          <div className="form-field">
            <label htmlFor="name" className="form-label">Nuevo Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Email - Lado a lado */}
        <div className="form-row form-row-side-by-side">
          {/* Datos Actuales (izquierda) */}
          <div className="form-field form-field-display">
            <label className="form-label">Email Actual</label>
            <div className="display-value">
              {usuarioActual?.email || 'No disponible'}
            </div>
          </div>

          {/* Input de Edición (derecha) */}
          <div className="form-field">
            <label htmlFor="email" className="form-label">Nuevo Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button 
            type="button" 
            onClick={handleDeleteAccount}
            className="btn-danger"
            disabled={loading}
          >
            <Trash2 size={18} />
            Eliminar Cuenta
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;