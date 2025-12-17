import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Filter, Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { fetchWithAuth, deleteReview } from '../services/fetch';

const AdminComentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const navigate = useNavigate();

  useEffect(() => {
    const cargarComentarios = async () => {
      try {
        const res = await fetchWithAuth('http://127.0.0.1:8000/api/crear-comentario/', {
          method: 'GET',
        });

        const data = await res.json();
        const comentariosArray = Array.isArray(data) ? data : (data.results || []);

        const normalizados = comentariosArray.map((c) => ({
          id: c.id,
          usuario: c.usuario_nombre || `Usuario #${c.usuario}`,
          contenido: c.contenido,
          fecha_creacion: c.fecha_creacion,
          estado: c.estado || 'aprobado',
          reporte_id: c.reporte_id || null,
          reporte_titulo: c.reporte_titulo || 'Comentario de reporte',
        }));

        setComentarios(normalizados);
      } catch (error) {
        console.error('Error cargando comentarios:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarComentarios();
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

  const handleEliminarComentario = async (comentarioId) => {
    if (!window.confirm('¿Estás seguro de eliminar este comentario?')) {
      return;
    }

    try {
      await deleteReview(comentarioId);
      setComentarios(prev => prev.filter(c => c.id !== comentarioId));
    } catch (error) {
      console.error('Error eliminando comentario:', error);
      alert(error.message || 'Error al eliminar el comentario');
    }
  };

  const handleVerComentario = () => {
    navigate('/home');
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
      <div className="admin-card">
        <h2 className="admin-card-title">Moderación de Comentarios</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando comentarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2 className="admin-card-title">Moderación de Comentarios</h2>
        <p className="admin-card-subtitle">
          Revisa y gestiona los comentarios de los reportes
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="admin-form-group">
        <div className="admin-filters-row">
          <div className="admin-filters-col">
            <label className="admin-form-label">Buscar comentarios</label>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
              <input
                type="text"
                placeholder="Buscar comentarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="admin-filters-col">
            <label className="admin-form-label">Filtrar por estado</label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="admin-form-select"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobado">Aprobados</option>
              <option value="rechazado">Rechazados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <MessageSquare size={24} />
          </div>
          <div className="admin-stat-value">{comentarios.length}</div>
          <div className="admin-stat-label">Total Comentarios</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Clock size={24} />
          </div>
          <div className="admin-stat-value">{comentarios.filter(c => c.estado === 'pendiente').length}</div>
          <div className="admin-stat-label">Pendientes</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="admin-stat-value">{comentarios.filter(c => c.estado === 'aprobado').length}</div>
          <div className="admin-stat-label">Aprobados</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="admin-stat-value">{comentarios.filter(c => c.estado === 'rechazado').length}</div>
          <div className="admin-stat-label">Rechazados</div>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Reporte</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Comentario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredComentarios.map((comentario) => (
              <tr key={comentario.id}>
                <td>{comentario.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--admin-primary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      {comentario.usuario.charAt(0).toUpperCase()}
                    </div>
                    <span>{comentario.usuario}</span>
                  </div>
                </td>
                <td>
                  <span>
                    Reporte #{comentario.reporte_id} • {comentario.reporte_titulo}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getEstadoIcon(comentario.estado)}
                    <span className={`estado-badge ${comentario.estado}`}>{comentario.estado}</span>
                  </div>
                </td>
                <td>{new Date(comentario.fecha_creacion).toLocaleString('es-ES')}</td>
                <td>
                  <span>{comentario.contenido}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {comentario.estado === 'pendiente' && (
                      <>
                        <button
                          onClick={() => handleAprobarComentario(comentario.id)}
                          className="admin-btn"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="Aprobar comentario"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          onClick={() => handleRechazarComentario(comentario.id)}
                          className="admin-btn"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="Rechazar comentario"
                        >
                          <AlertCircle size={14} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={handleVerComentario}
                      className="admin-btn"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      title="Ver"
                    >
                      <MessageSquare size={14} />
                    </button>
                    <button
                      onClick={() => handleEliminarComentario(comentario.id)}
                      className="admin-btn admin-btn-primary"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: 'var(--admin-secondary)' }}
                      title="Eliminar comentario"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminComentarios;
