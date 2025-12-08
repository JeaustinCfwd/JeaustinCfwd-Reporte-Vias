import React from 'react';
import { User, Lock, Settings, LogOut } from 'lucide-react';
import "../styles/Profile.css";

export const PFSidebar = ({ activeTab, setActiveTab, onLogout }) => {
    return (
        <aside className="profile-sidebar">
            <div className="sidebar-section">
                <h3 className="sidebar-category">TU CUENTA</h3>
                <nav className="sidebar-nav">
                    <button
                        onClick={() => setActiveTab('edit')}
                        className={`sidebar-link ${activeTab === 'edit' ? 'active' : ''}`}
                    >
                        <User size={18} />
                        Perfil
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`sidebar-link ${activeTab === 'password' ? 'active' : ''}`}
                    >
                        <Lock size={18} />
                        Cambiar Contraseña
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
                    >
                        <Settings size={18} />
                        Configuración
                    </button>
                </nav>
            </div>

            <div className="sidebar-section">
                <button onClick={onLogout} className="sidebar-link sidebar-logout">
                    <LogOut size={18} />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};
