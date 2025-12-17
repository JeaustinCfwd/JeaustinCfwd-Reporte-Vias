import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, PieChart, Activity } from 'lucide-react';
import AdminPanel from '../components/AdminPanel';
import AdminSidebar from '../components/AdminSidebar';
import AdminReportes from '../components/AdminReportes';
import AdminUsuarios from '../components/AdminUsuarios';
import AdminComentarios from '../components/AdminComentarios';
import '../components/DBConfigGraficos';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useReportes } from '../components/DBUseReportes';
import { useEstadisticas } from '../components/DBUseEstadisticas';
import { CHART_OPTIONS } from '../components/DBConstantes';
import '../styles/AdminDashboard.css';

const AdminEstadisticas = () => {
  const { reports, filteredReports, loading } = useReportes();
  const { statsByState, statsByCategory, stateData, categoryData, timelineData } =
    useEstadisticas(filteredReports, reports);

  const totalReportes = reports.length;
  const totalEstados = Object.keys(statsByState).length;
  const totalCategorias = Object.keys(statsByCategory).length;

  if (loading) {
    return (
      <div className="admin-card">
        <h2 className="admin-card-title">Estadísticas</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2 className="admin-card-title">Estadísticas de Reportes</h2>
        <p className="admin-card-subtitle">
          Visualiza el comportamiento general de los reportes del sistema
        </p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="admin-stat-value">{totalReportes}</div>
          <div className="admin-stat-label">Reportes totales</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <PieChart size={24} />
          </div>
          <div className="admin-stat-value">{totalCategorias}</div>
          <div className="admin-stat-label">Categorías distintas</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Activity size={24} />
          </div>
          <div className="admin-stat-value">{totalEstados}</div>
          <div className="admin-stat-label">Estados distintos</div>
        </div>
      </div>

      <div className="admin-charts-grid">
        <div className="admin-chart-card">
          <h3 className="admin-chart-title">Tendencia de reportes (últimos 7 días)</h3>
          <div className="admin-chart-wrapper">
            <Line data={timelineData} options={CHART_OPTIONS} />
          </div>
        </div>

        <div className="admin-chart-card">
          <h3 className="admin-chart-title">Distribución por estado</h3>
          <div className="admin-chart-wrapper">
            <Bar data={stateData} options={CHART_OPTIONS} />
          </div>
        </div>

        <div className="admin-chart-card">
          <h3 className="admin-chart-title">Reportes por categoría</h3>
          <div className="admin-chart-wrapper">
            <Pie data={categoryData} options={CHART_OPTIONS} />
          </div>
        </div>
      </div>
    </div>
  );
};

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
        return <AdminEstadisticas />;
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
