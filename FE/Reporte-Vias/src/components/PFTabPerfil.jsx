import React from 'react';
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

                {/* Nombre - Lado a lado */}
                <PFCampo
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    sideBySide
                    displayValue={usuarioActual?.username || user?.name || 'No disponible'}
                />

                {/* Email - Lado a lado */}
                <PFCampo
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
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
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Cuéntanos sobre ti..."
                />

                {/* Teléfono */}
                <PFCampo
                    label="Teléfono"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1234567890"
                />

                {/* Ubicación */}
                <PFCampo
                    label="Ubicación"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Ciudad, País"
                />

                {/* Sitio Web */}
                <PFCampo
                    label="Sitio Web"
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://tusitio.com"
                />

                {/* Fecha de Nacimiento */}
                <PFCampo
                    label="Fecha de Nacimiento"
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                />

                {/* Género */}
                <PFCampo
                    label="Género"
                    type="select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    options={genderOptions}
                />

                {/* Botones de Acción */}
                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};
