import React from 'react'; // 1. ELIMINACIÓN: Se quitan `useState` y `useEffect`.
import PFFoto from './PFFoto';
import PFCampo from './PFCampo';
import { usePFFormulario } from './PFFormulario';
import "../styles/Profile.css";

export const PFTabPerfil = ({ usuarioActual }) => {

    const {
        user, // Este objeto tendrá la información para mostrar.
        formData, // Este objeto tendrá la información para los campos de edición.
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

    // 2. ELIMINACIÓN: Se borra el `useState` y el `useEffect` que traían datos del usuario.
    // ¡Toda esa lógica ahora vive felizmente en `usePFFormulario`!

    return (
        <div className="profile-content">
            <h1 className="profile-title">Editar Perfil</h1>
            <p className="profile-subtitle">Actualiza tu información personal</p>

            <form onSubmit={handleSubmit} className="profile-form">
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <PFFoto
                    photoPreview={photoPreview}
                    onPhotoChange={handlePhotoChange}
                    onRemovePhoto={handleRemovePhoto}
                />

                <div className="form-section-divider">
                    <h2 className="form-section-title">Información Personal</h2>
                </div>

                {/* 3. CORRECCIÓN: Se usan las fuentes de datos correctas del hook. */}
                <PFCampo
                    label="Nombre"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    sideBySide
                    displayValue={user?.username}
                />

                <PFCampo
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    sideBySide
                    displayValue={user?.email}
                />

                <div className="form-section-divider">
                    <h2 className="form-section-title">Información Adicional</h2>
                </div>

                {/* 4. SIMPLIFICACIÓN: Todos los demás campos usan `formData`. */}
                <PFCampo
                    label="Biografía"
                    type="textarea"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Cuéntanos sobre ti..."
                />

                <PFCampo
                    label="Teléfono"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1234567890"
                />

                <PFCampo
                    label="Ubicación"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Ciudad, País"
                />

                <PFCampo
                    label="Fecha de Nacimiento"
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleInputChange}
                />

                <PFCampo
                    label="Género"
                    type="select"
                    name="gender"
                    value={formData.gender}
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