import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Filter, Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const AdminComentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [selectedComentario, setSelectedComentario] = useState(null);

  useEffect(() => {
    // Simulación de carga de datos
    setTimeout(() => {
      setComentarios([
        {
          id: 1,
          reporte_id: 101,
          usuario: 'usuario1',
          contenido: 'Este reporte necesita atención urgente, hay un bache muy grande',
          fecha_creacion: '2023-12-10 14:30',
          estado: 'pendiente',
          reporte_titulo: 'Bache en avenida central'
        },
        {
          id: 2,
          reporte_id: 102,
          usuario: 'usuario2',
          contenido: 'Ya fue reparado, gracias por la atención',
          fecha_creacion: '2023-12-11 09:15',
          estado: 'aprobado',
          reporte_titulo: 'Semáforo dañado'
        },
        {
          id: 3,
          reporte_id: 103,
          usuario: 'usuario3',
          contenido: 'Contenido inapropiado en este comentario',
          fecha_creacion: '2023-12-12 16:45',
          estado: 'rechazado',
          reporte_titulo: 'Señalización deficiente'
        },
        {
          id: 4,
          reporte_id: 104,
          usuario: 'Jeaustin',
          contenido: 'Excelente trabajo del equipo municipal',
          fecha_creacion: '2023-12-13 11:20',
          estado: 'pendiente',
          reporte_titulo: 'Alcantarilla dañada'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredComentarios = comentarios.filter(comentario => {
    const matchesSearch = comentario.contenido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comentario.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comentario.reporte_titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEstado === 'todos' || comentario.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  const handleAprobarComentario = (comentarioId) => {
    setComentarios(prev => prev.map(c => 
      c.id === comentarioId ? { ...c, estado: 'aprobado' } : c
    ));
  };

  const handleRechazarComentario = (comentarioId) => {
    setComentarios(prev => prev.map(c => 
      c.id === comentarioId ? { ...c, estado: 'rechazado' } : c
    ));
  };

  const handleEliminarComentario = (comentarioId) => {
    if (window.confirm('¿Estás seguro de eliminar este comentario?')) {
      setComentarios(prev => prev.filter(c => c.id !== comentarioId));
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'aprobado':
        return <CheckCircle size={16} className="estado-icon aprobado" />;
      case 'rechazado':
        return <AlertCircle size={16} className="estado-icon rechazado" />;
      default:
        return <Clock size={16} className="estado-icon pendiente" />;
    }
  };

  if (loading) {
    return (
      <div className="overview-content">
        <h2 className="dashboard-title">Moderación de Comentarios</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando comentarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-content">
      <div className="admin-header">
        <h2 className="dashboard-title">Moderación de Comentarios</h2>
        <p className="dashboard-subtitle">
          Revisa y gestiona los comentarios de los reportes
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="admin-filters">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar comentarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <Filter size={20} className="filter-icon" />
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="aprobado">Aprobados</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <MessageSquare size={24} />
          </div>
          <div className="stat-content">
            <h3>{comentarios.length}</h3>
            <p>Total Comentarios</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{comentarios.filter(c => c.estado === 'pendiente').length}</h3>
            <p>Pendientes</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon approved">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{comentarios.filter(c => c.estado === 'aprobado').length}</h3>
            <p>Aprobados</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon rejected">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{comentarios.filter(c => c.estado === 'rechazado').length}</h3>
            <p>Rechazados</p>
          </div>
        </div>
      </div>

      {/* Lista de comentarios */}
      <div className="comentarios-list">
        {filteredComentarios.map(comentario => (
          <div key={comentario.id} className="comentario-card">
            <div className="comentario-header">
              <div className="comentario-info">
                <div className="usuario-info">
                  <div className="user-avatar small">
                    {comentario.usuario.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4>{comentario.usuario}</h4>
                    <p className="comentario-meta">
                      Reporte #{comentario.reporte_id} • {comentario.reporte_titulo}
                    </p>
                  </div>
                </div>
                <div className="comentario-estado">
                  {getEstadoIcon(comentario.estado)}
                  <span className={`estado-badge ${comentario.estado}`}>
                    {comentario.estado}
                  </span>
                </div>
              </div>
              <div className="comentario-fecha">
                {new Date(comentario.fecha_creacion).toLocaleString('es-ES')}
              </div>
            </div>
            
            <div className="comentario-contenido">
              <p>{comentario.contenido}</p>
            </div>
            
            <div className="comentario-actions">
              {comentario.estado === 'pendiente' && (
                <>
                  <button
                    onClick={() => handleAprobarComentario(comentario.id)}
                    className="btn-approve"
                    title="Aprobar comentario"
                  >
                    <CheckCircle size={16} />
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleRechazarComentario(comentario.id)}
                    className="btn-reject"
                    title="Rechazar comentario"
                  >
                    <AlertCircle size={16} />
                    Rechazar
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedComentario(comentario)}
                className="btn-view"
                title="Ver detalles"
              >
                <MessageSquare size={16} />
                Ver
              </button>
              <button
                onClick={() => handleEliminarComentario(comentario.id)}
                className="btn-delete"
                title="Eliminar comentario"
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalles */}
      {selectedComentario && (
        <div className="modal-overlay">
          <div className="modal-content comentario-modal">
            <div className="modal-header">
              <h3>Detalles del Comentario</h3>
              <button
                onClick={() => setSelectedComentario(null)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detalle-info">
                <div className="info-row">
                  <label>Usuario:</label>
                  <span>{selectedComentario.usuario}</span>
                </div>
                <div className="info-row">
                  <label>Reporte:</label>
                  <span>#{selectedComentario.reporte_id} - {selectedComentario.reporte_titulo}</span>
                </div>
                <div className="info-row">
                  <label>Fecha:</label>
                  <span>{new Date(selectedComentario.fecha_creacion).toLocaleString('es-ES')}</span>
                </div>
                <div className="info-row">
                  <label>Estado:</label>
                  <span className={`estado-badge ${selectedComentario.estado}`}>
                    {getEstadoIcon(selectedComentario.estado)}
                    {selectedComentario.estado}
                  </span>
                </div>
              </div>
              
              <div className="detalle-contenido">
                <label>Comentario:</label>
                <div className="comentario-text">
                  {selectedComentario.contenido}
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              {selectedComentario.estado === 'pendiente' && (
                <>
                  <button
                    onClick={() => {
                      handleAprobarComentario(selectedComentario.id);
                      setSelectedComentario(null);
                    }}
                    className="btn-approve"
                  >
                    <CheckCircle size={16} />
                    Aprobar
                  </button>
                  <button
                    onClick={() => {
                      handleRechazarComentario(selectedComentario.id);
                      setSelectedComentario(null);
                    }}
                    className="btn-reject"
                  >
                    <AlertCircle size={16} />
                    Rechazar
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  handleEliminarComentario(selectedComentario.id);
                  setSelectedComentario(null);
                }}
                className="btn-delete"
              >
                <Trash2 size={16} />
                Eliminar
              </button>
              <button
                onClick={() => setSelectedComentario(null)}
                className="btn-secondary"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComentarios;
