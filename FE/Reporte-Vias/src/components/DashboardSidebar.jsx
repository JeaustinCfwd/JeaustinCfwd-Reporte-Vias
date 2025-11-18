import React from 'react';

const DashboardSidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  activeView, 
  setActiveView, 
  exportToCSV 
}) => {
  return (
    <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        {sidebarOpen && <h2>Dashboard</h2>}
        <button 
          className="sidebar-toggle" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? '←' : '→'}
        </button>
      </div>
      
      {sidebarOpen && (
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            📊 Resumen General
          </button>
          <button 
            className={`nav-item ${activeView === 'list' ? 'active' : ''}`}
            onClick={() => setActiveView('list')}
          >
            📋 Lista de Reportes
          </button>
          <button 
            className={`nav-item ${activeView === 'map' ? 'active' : ''}`}
            onClick={() => setActiveView('map')}
          >
            🗺️ Mapa Interactivo
          </button>
          <button 
            className={`nav-item ${activeView === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveView('stats')}
          >
            📈 Estadísticas Detalladas
          </button>
          
          <div className="sidebar-divider"></div>
          
          <button className="nav-item export-btn" onClick={exportToCSV}>
            💾 Exportar CSV
          </button>
        </nav>
      )}
    </aside>
  );
};

export default DashboardSidebar;