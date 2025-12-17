import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';
import AdminSidebar from '../components/AdminSidebar';
import AdminReportes from '../components/AdminReportes';
import AdminUsuarios from '../components/AdminUsuarios';
import AdminComentarios from '../components/AdminComentarios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('reportes');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('id_usuario');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'reportes':
        return <AdminReportes />;
      case 'usuarios':
        return <AdminUsuarios />;
      case 'comentarios':
        return <AdminComentarios />;
      case 'estadisticas':
        return (
          <div className="overview-content">
            <h2 className="dashboard-title">Estadísticas</h2>
            <p>Panel de estadísticas en construcción...</p>
          </div>
        );
      default:
        return <AdminReportes />;
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <AdminSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />
      <main className="admin-main-content">
        <div className="admin-dashboard-container">
          <div className="admin-header">
            <div className="admin-header-top">
              <div className="admin-title-section">
                <h1>Panel de Administración</h1>
                <p>
                  Gestiona reportes, usuarios y comentarios del sistema
                  <span className="admin-status-badge">Activo</span>
                </p>
              </div>
            </div>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
