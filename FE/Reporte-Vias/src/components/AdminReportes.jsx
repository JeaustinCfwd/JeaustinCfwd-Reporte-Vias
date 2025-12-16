import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/fetch';

export const AdminReportes = () => {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      const response = await fetchWithAuth('http://127.0.0.1:8000/api/crear-reporte/');
      const data = await response.json();
      setReportes(data.results || []);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstadoReporte = async (idReporte, nuevoEstado) => {
    try {
      await fetchWithAuth(`http://127.0.0.1:8000/api/reporte/${idReporte}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      
      // Actualizar lista local
      setReportes(prev => 
        prev.map(reporte => 
          reporte.id === idReporte 
            ? { ...reporte, estado: nuevoEstado }
            : reporte
        )
      );
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const reportesFiltrados = filtroEstado === 'todos' 
    ? reportes 
    : reportes.filter(r => r.estado === parseInt(filtroEstado));

  if (cargando) {
    return <div className="cargando">Cargando reportes...</div>;
  }

  return (
    <div className="overview-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Gestión de Reportes</h1>
        <p className="dashboard-subtitle">Administrar y moderar todos los reportes del sistema</p>
      </div>
      
      <div className="filtros">
        <select 
          value={filtroEstado} 
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="filtro-select"
        >
          <option value="todos">Todos los estados</option>
          <option value="1">Nuevos</option>
          <option value="2">En Revisión</option>
          <option value="3">Resueltos</option>
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-detail-card">
          <h3>Reportes Totales</h3>
          <div className="metric-row">
            <span>Total:</span>
            <strong>{reportes.length}</strong>
          </div>
          <div className="metric-row">
            <span>Filtrados:</span>
            <strong>{reportesFiltrados.length}</strong>
          </div>
          <div className="reportes-lista-vertical">
            <h4>Lista de Reportes</h4>
            {reportesFiltrados.map(reporte => (
              <div key={reporte.id} className="reporte-item">
                <div className="metric-row">
                  <span>ID:</span>
                  <strong>{reporte.id}</strong>
                </div>
                <div className="metric-row">
                  <span>Título:</span>
                  <strong>{reporte.titulo || 'Sin título'}</strong>
                </div>
                <div className="metric-row">
                  <span>Usuario:</span>
                  <strong>{reporte.usuario_nombre || 'Desconocido'}</strong>
                </div>
                <div className="metric-row">
                  <span>Estado:</span>
                  <select 
                    value={reporte.estado}
                    onChange={(e) => cambiarEstadoReporte(reporte.id, parseInt(e.target.value))}
                    className="estado-select"
                  >
                    <option value={1}>Nuevo</option>
                    <option value={2}>En Revisión</option>
                    <option value={3}>Resuelto</option>
                  </select>
                </div>
                <div className="metric-row">
                  <span>Fecha:</span>
                  <strong>{new Date(reporte.fecha_creacion).toLocaleDateString()}</strong>
                </div>
                <hr className="reporte-separador" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportes;
