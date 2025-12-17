import React, { useState, useEffect } from 'react';
import { BarChart3, Search } from 'lucide-react';
import { fetchWithAuth, patchData } from '../services/fetch';

export const AdminReportes = () => {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
        const res = await fetchWithAuth('http://localhost:8000/api/crear-reporte/', {
            method: 'GET',
        });
        const data = await res.json();
        const reportsData = Array.isArray(data) ? data : (data.results || []);
        setReportes(reportsData);
        setCargando(false);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      setCargando(false);
    }
  };

  const cambiarEstadoReporte = async (idReporte, nuevoEstado) => {
    try {
      // 1. Actualización optimista en la UI
      setReportes(prev =>
        prev.map(reporte =>
          reporte.id === idReporte
            ? { ...reporte, estado: nuevoEstado }
            : reporte
        )
      );

      // 2. Llamada a la API real
      await patchData(`editar-reporte/${idReporte}/`, { estado: nuevoEstado });
      
      // Opcional: Recargar para asegurar consistencia
      // await cargarReportes();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      // Revertir cambio si falla
      cargarReportes();
    }
  };

  const reportesFiltrados = filtroEstado === 'todos' 
    ? reportes 
    : reportes.filter(r => r.estado === parseInt(filtroEstado));

  if (cargando) {
    return <div className="cargando">Cargando reportes...</div>;
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2 className="admin-card-title">Gestión de Reportes</h2>
        <p className="admin-card-subtitle">Administrar y moderar todos los reportes del sistema</p>
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Filtrar por Estado</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="admin-form-select"
        >
          <option value="todos">Todos los estados</option>
          <option value="1">Nuevos</option>
          <option value="2">En Revisión</option>
          <option value="3">Resueltos</option>
        </select>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="admin-stat-value">{reportes.length}</div>
          <div className="admin-stat-label">Reportes Totales</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Search size={24} />
          </div>
          <div className="admin-stat-value">{reportesFiltrados.length}</div>
          <div className="admin-stat-label">Reportes Filtrados</div>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {reportesFiltrados.map(reporte => (
              <tr key={reporte.id}>
                <td>{reporte.id}</td>
                <td>{reporte.titulo || 'Sin título'}</td>
                <td>{reporte.usuario_nombre || 'Desconocido'}</td>
                <td>
                  <select
                    value={reporte.estado}
                    onChange={(e) => cambiarEstadoReporte(reporte.id, parseInt(e.target.value))}
                    className="admin-form-select"
                  >
                    <option value={1}>Nuevo</option>
                    <option value={2}>En Revisión</option>
                    <option value={3}>Resuelto</option>
                  </select>
                </td>
                <td>{new Date(reporte.fecha_creacion).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReportes;
