import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  Filler 
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Importar componentes
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import OverviewView from './OverviewView';
import ListView from './ListView';
import MapView from './MapView';
import StatsView from './StatsView';

// ==================== CONFIGURACIÓN DE CHART.JS ====================
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler 
);

// ==================== CONSTANTES ====================
const STATE_COLORS = {
  nuevo: { bg: 'rgba(252, 129, 129, 0.8)', border: 'rgba(252, 129, 129, 1)' },
  en_revision: { bg: 'rgba(90, 103, 216, 0.8)', border: 'rgba(90, 103, 216, 1)' },
  atendido: { bg: 'rgba(72, 187, 120, 0.8)', border: 'rgba(72, 187, 120, 1)' }
};

const CATEGORY_PALETTE = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
  }
};

// ==================== COMPONENTE CONTENEDOR ====================
const DashboardContent = () => {
  // ========== HOOKS ==========
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  // ========== ESTADO ==========
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Filtros
  const [filterState, setFilterState] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // ========== EFECTOS ==========
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/api/crear-reporte/', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        
        if (res.status === 401) {
          setError('No autorizado. Por favor inicia sesión.');
          navigate('/login');
          return;
        }
        
        if (!res.ok) throw new Error(`Error fetching reports: ${res.status}`);
        
        const data = await res.json();
        const reportsData = Array.isArray(data) ? data : (data.results || []);
        setReports(reportsData);
      } catch (err) {
        setError(err.message);
        const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
        setReports(storedReports);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  // ========== DATOS COMPUTADOS ==========
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      if (filterState !== 'all' && report.state !== filterState) return false;
      if (filterCategory !== 'all' && report.category !== filterCategory) return false;
      if (filterDateFrom && new Date(report.timestamp) < new Date(filterDateFrom)) return false;
      if (filterDateTo && new Date(report.timestamp) > new Date(filterDateTo)) return false;
      
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          report.titulo?.toLowerCase().includes(search) ||
          report.description?.toLowerCase().includes(search)
        );
      }
      
      return true;
    });
  }, [reports, filterState, filterCategory, filterDateFrom, filterDateTo, searchTerm]);

  const statsByState = useMemo(() => {
    return filteredReports.reduce((acc, report) => {
      acc[report.state] = (acc[report.state] || 0) + 1;
      return acc;
    }, {});
  }, [filteredReports]);

  const statsByCategory = useMemo(() => {
    return filteredReports.reduce((acc, report) => {
      const cat = (report.category || 'Sin Categoría').replace(/_/g, ' ');
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
  }, [filteredReports]);

  const categories = useMemo(() => {
    const cats = new Set(reports.map(r => r.category));
    return Array.from(cats);
  }, [reports]);

  // ========== DATOS PARA GRÁFICOS ==========
  const stateData = useMemo(() => ({
    labels: ['Nuevos', 'En Revisión', 'Atendidos'],
    datasets: [{
      label: 'Número de Reportes',
      data: [
        statsByState.nuevo || 0,
        statsByState.en_revision || 0,
        statsByState.atendido || 0
      ],
      backgroundColor: [
        STATE_COLORS.nuevo.bg,
        STATE_COLORS.en_revision.bg,
        STATE_COLORS.atendido.bg
      ],
      borderColor: [
        STATE_COLORS.nuevo.border,
        STATE_COLORS.en_revision.border,
        STATE_COLORS.atendido.border
      ],
      borderWidth: 1
    }]
  }), [statsByState]);

  const categoryData = useMemo(() => ({
    labels: Object.keys(statsByCategory),
    datasets: [{
      label: 'Reportes por Categoría',
      data: Object.values(statsByCategory),
      backgroundColor: CATEGORY_PALETTE.slice(0, Object.keys(statsByCategory).length),
      hoverBackgroundColor: CATEGORY_PALETTE.slice(0, Object.keys(statsByCategory).length)
    }]
  }), [statsByCategory]);

  const timelineData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const counts = last7Days.map(date => {
      return filteredReports.filter(r => 
        r.timestamp && r.timestamp.split('T')[0] === date
      ).length;
    });

    return {
      labels: last7Days.map(d => new Date(d).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Reportes por Día',
        data: counts,
        borderColor: 'rgb(90, 103, 216)',
        backgroundColor: 'rgba(90, 103, 216, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }, [filteredReports]);

  // ========== FUNCIONES DE GESTIÓN ==========
  const handleDeleteReport = useCallback(async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este reporte?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/eliminar-reporte/${id}/`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      
      if (!res.ok) throw new Error(`Error deleting report: ${res.status}`);
      
      setReports(reports.filter(report => String(report.id) !== String(id)));
      success('Reporte eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting report:', error);
      showError('Error al eliminar el reporte');
    }
  }, [reports, success, showError]);

  const handleUpdateState = useCallback(async (id, newState) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/reportes/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ state: newState })
      });
      
      if (!res.ok) throw new Error(`Error updating report: ${res.status}`);

      const updatedReport = await res.json();
      setReports(reports.map(report =>
        String(report.id) === String(id) ? updatedReport : report
      ));
      success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error updating report state:', error);
      showError('Error al actualizar el estado');
    }
  }, [reports, success, showError]);

  const exportToCSV = useCallback(() => {
    try {
      const headers = ['ID', 'Título', 'Descripción', 'Estado', 'Categoría', 'Latitud', 'Longitud', 'Fecha'];
      const rows = filteredReports.map(r => [
        r.id,
        r.titulo || '',
        r.description || '',
        r.state || '',
        r.category || '',
        r.lat || '',
        r.lng || '',
        r.timestamp ? new Date(r.timestamp).toLocaleString('es-ES') : ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reportes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      success('Archivo CSV descargado exitosamente');
    } catch (error) {
      showError('Error al exportar el archivo CSV');
    }
  }, [filteredReports, success, showError]);

  const clearFilters = () => {
    setFilterState('all');
    setFilterCategory('all');
    setFilterDateFrom('');
    setFilterDateTo('');
    setSearchTerm('');
  };

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
    <div className="dashboard-wrapper">
      {/* ==================== SIDEBAR ==================== */}
      <DashboardSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        exportToCSV={exportToCSV}
      />

      {/* ==================== CONTENIDO PRINCIPAL ==================== */}
      <main className={`dashboard-main ${sidebarOpen ? '' : 'full-width'}`}>
        {/* Header con filtros */}
        <DashboardHeader 
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
          <OverviewView 
            filteredReports={filteredReports}
            statsByState={statsByState}
            timelineData={timelineData}
            stateData={stateData}
            categoryData={categoryData}
            CHART_OPTIONS={CHART_OPTIONS}
          />
        )}

        {activeView === 'list' && (
          <ListView 
            filteredReports={filteredReports}
            handleUpdateState={handleUpdateState}
            handleDeleteReport={handleDeleteReport}
          />
        )}

        {activeView === 'map' && (
          <MapView 
            filteredReports={filteredReports}
            statsByState={statsByState}
          />
        )}

        {activeView === 'stats' && (
          <StatsView 
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
};

export default DashboardContent;