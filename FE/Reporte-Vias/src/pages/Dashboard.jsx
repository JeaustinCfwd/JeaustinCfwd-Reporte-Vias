import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

// Importar configuración de gráficos (debe ser lo primero)
import '../components/DBConfigGraficos';

// Importar hooks personalizados
import { useReportes } from '../components/DBUseReportes';
import { useFiltros } from '../components/DBUseFiltros';
import { useEstadisticas } from '../components/DBUseEstadisticas';
import { useAcciones } from '../components/DBUseAcciones';

// Importar constantes
import { CHART_OPTIONS } from '../components/DBConstantes';

// Importar componentes de vista
import DBSidebar from '../components/DBSidebar';
import DBEncabezado from '../components/DBEncabezado';
import DBVistaResumen from '../components/DBVistaResumen';
import DBVistaLista from '../components/DBVistaLista';
import DBVistaMapa from '../components/DBVistaMapa';
import DBVistaEstadisticas from '../components/DBVistaEstadisticas';

function Dashboard() {
  // ========== HOOKS PERSONALIZADOS ==========
  const { reports, setReports, loading, error, filteredReports, setFilteredReports } = useReportes();

  const {
    filterState,
    setFilterState,
    filterCategory,
    setFilterCategory,
    filterDateFrom,
    setFilterDateFrom,
    filterDateTo,
    setFilterDateTo,
    searchTerm,
    setSearchTerm,
    clearFilters
  } = useFiltros();

  const {
    statsByState,
    statsByCategory,
    categories,
    stateData,
    categoryData,
    timelineData
  } = useEstadisticas(filteredReports, reports);

  const {
    handleDeleteReport,
    handleUpdateState,
    handleUpdateReport,
    exportToCSV
  } = useAcciones(reports, setReports, filteredReports);

  // ========== ESTADO LOCAL ==========
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ========== EFECTOS ==========
  // Gestión de clases del body para el sidebar
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.remove('sidebar-closed');
    } else {
      document.body.classList.add('sidebar-closed');
    }
  }, [sidebarOpen]);

  // ========== RENDERIZADO CONDICIONAL ==========
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  // ========== RENDER PRINCIPAL ==========
  return (
    <div className="dashboard-page-wrapper">
      {/* ==================== SIDEBAR ==================== */}
      <DBSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        exportToCSV={exportToCSV}
      />

      {/* ==================== CONTENIDO PRINCIPAL ==================== */}
      <main className="dashboard-main">
        {/* Botón de Menú Hamburguesa */}
        <div className="home-content">
          <i className='bx bx-menu' onClick={() => setSidebarOpen(!sidebarOpen)}></i>
        </div>

        {/* Header con filtros */}
        <DBEncabezado
          filteredReports={filteredReports}
          reports={reports}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterState={filterState}
          setFilterState={setFilterState}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterDateFrom={filterDateFrom}
          setFilterDateFrom={setFilterDateFrom}
          filterDateTo={filterDateTo}
          setFilterDateTo={setFilterDateTo}
          clearFilters={clearFilters}
          categories={categories}
        />

        {/* ==================== VISTAS ==================== */}
        {activeView === 'overview' && (
          <DBVistaResumen
            filteredReports={filteredReports}
            statsByState={statsByState}
            timelineData={timelineData}
            stateData={stateData}
            categoryData={categoryData}
            CHART_OPTIONS={CHART_OPTIONS}
          />
        )}

        {activeView === 'list' && (
          <DBVistaLista
            filteredReports={filteredReports}
            handleUpdateState={handleUpdateState}
            handleDeleteReport={handleDeleteReport}
            handleUpdateReport={handleUpdateReport}
          />
        )}

        {activeView === 'map' && (
          <DBVistaMapa
            filteredReports={filteredReports}
            statsByState={statsByState}
          />
        )}

        {activeView === 'stats' && (
          <DBVistaEstadisticas
            reports={reports}
            filteredReports={filteredReports}
            statsByState={statsByState}
            statsByCategory={statsByCategory}
            stateData={stateData}
            categoryData={categoryData}
            CHART_OPTIONS={CHART_OPTIONS}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;