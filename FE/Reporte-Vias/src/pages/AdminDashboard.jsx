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
    <div className="dashboard-page-wrapper">
      <AdminSidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />
      <main className="dashboard-main">
        <div className="dashboard-wrapper">
          <div className="overview-content">
            <h1 className="dashboard-title">Panel de Administración</h1>
            <p className="dashboard-subtitle">
              Gestiona reportes, usuarios y comentarios del sistema
            </p>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
