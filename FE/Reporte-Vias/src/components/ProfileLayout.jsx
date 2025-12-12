import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../services/fetch';
import { logout } from '../services/fetch';
import { PFSidebar } from './PFSidebar.jsx';
import { PFTabPerfil } from './PFTabPerfil.jsx';
import { PFTabPassword } from './PFTabPassword.jsx';
import { PFTabConfiguracion } from './PFTabConfiguracion.jsx';
import "../styles/Profile.css";

const ProfileLayout = () => {
    const [activeSection, setActiveSection] = useState('edit');
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({});

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        async function traeUsuario() {
            const id_usuario = localStorage.getItem('id_usuario');
            if (!id_usuario) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetchWithAuth(`http://127.0.0.1:8000/api/usuario/${id_usuario}/`);
                const data = await response.json();
                // El endpoint /api/usuario/<id>/ ahora devuelve un SOLO objeto,
                // no una lista. Guardamos el objeto directamente.
                setUsuario(data || {});
            } catch (error) {
                console.error('Error al cargar usuario:', error);
            }
        }
        traeUsuario();
    }, [navigate]);

    return (
        <div className="profile-container">
            {/* Sidebar de Navegación */}
            <PFSidebar
                activeTab={activeSection}
                setActiveTab={setActiveSection}
                onLogout={handleLogout}
            />

            {/* Contenido Principal */}
            <main className="profile-main">
                {activeSection === 'edit' && <PFTabPerfil usuarioActual={usuario} />}
                {activeSection === 'password' && <PFTabPassword />}
                {activeSection === 'settings' && <PFTabConfiguracion />}
            </main>
        </div>
    );
};

export default ProfileLayout;
