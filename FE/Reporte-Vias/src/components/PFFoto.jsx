import React, { useEffect } from 'react';
import { User, Camera } from 'lucide-react';
import UploadImage from './UploadImage';
import { patchData } from '@/services/fetch';

const PFFoto = ({ photoPreview, onPhotoChange, onRemovePhoto }) => {

    // ===============================
    // 🔥 ACTUALIZA AUTOMÁTICAMENTE
    // ===============================
    const actualizarFotoUsuario = async () => {
        if (!photoPreview) return;

        const cambiarFoto = {
            id_usuario: localStorage.getItem('id_usuario'),
            img_perfil: photoPreview,
        };

        const peticion = await patchData('actualizar-usuario/', cambiarFoto);
        console.log('Foto actualizada:', peticion);
    };

    useEffect(() => {
        actualizarFotoUsuario();
    }, [photoPreview]);

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
                        {/* Input de archivo estilizado como botón principal */}
                        <UploadImage setImgUrl={onPhotoChange} className="photo-upload-btn" />

                        {photoPreview && (
                            <button
                                type="button"
                                onClick={onRemovePhoto}
                                className="photo-remove-btn"
                            >
                                Eliminar foto
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PFFoto;
