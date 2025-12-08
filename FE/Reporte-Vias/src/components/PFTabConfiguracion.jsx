import React, { useState } from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { deleteUser } from '../services/fetch.js';
import { useNavigate } from 'react-router-dom';
import "../styles/Profile.css";

export const PFTabConfiguracion = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
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

    return (
        <div className="profile-content">
            <h1 className="profile-title">Configuración de Cuenta</h1>
            <p className="profile-subtitle">Administra las opciones de tu cuenta</p>

            <div className="profile-form">
                {/* Zona Peligrosa */}
                <div className="form-row">
                    <label className="form-label">
                        <Trash2 size={18} />
                        Zona Peligrosa
                    </label>
                    <div className="form-field">
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
            </div>
        </div>
    );
};
