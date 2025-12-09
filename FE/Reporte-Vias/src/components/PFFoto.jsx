import React from 'react';
import { User, Camera } from 'lucide-react';

const PFFoto = ({ photoPreview, onPhotoChange, onRemovePhoto }) => {
    return (
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
                                onClick={onRemovePhoto}
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
                            onChange={onPhotoChange}
                            className="photo-input-hidden"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PFFoto;
