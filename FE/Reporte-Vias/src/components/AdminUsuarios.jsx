import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Edit, Trash2, Shield, User, Users2, CheckCircle } from 'lucide-react';
import { fetchWithAuth, updateUser, deleteUser } from '../services/fetch';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('todos');
  const [editingUser, setEditingUser] = useState(null);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('http://localhost:8000/api/crear-lista/', {
        method: 'GET',
      });
      const data = await res.json();
      const usuariosArray = Array.isArray(data) ? data : (data.results || []);
      const usuariosFormateados = usuariosArray.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        rol: u.rol,
        estado: u.is_active ? 'activo' : 'inactivo',
        fecha_creacion: u.date_joined,
      }));
      setUsuarios(usuariosFormateados);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRol === 'todos' || usuario.rol === filterRol;
    return matchesSearch && matchesFilter;
  });

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    try {
      const payload = {
        username: editingUser.username,
        email: editingUser.email,
        rol: editingUser.rol,
        is_active: editingUser.estado === 'activo',
      };
      const updatedUser = await updateUser(editingUser.id, payload);
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                username: updatedUser.username,
                email: updatedUser.email,
                rol: updatedUser.rol,
                estado: updatedUser.is_active ? 'activo' : 'inactivo',
                fecha_creacion: updatedUser.date_joined || u.fecha_creacion,
              }
            : u
        )
      );
      setEditingUser(null);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) {
      return;
    }
    try {
      await deleteUser(userId);
      setUsuarios((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleToggleEstado = async (userId) => {
    const usuario = usuarios.find((u) => u.id === userId);
    if (!usuario) return;
    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
    try {
      const updatedUser = await updateUser(userId, {
        is_active: nuevoEstado === 'activo',
      });
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                estado: updatedUser.is_active ? 'activo' : 'inactivo',
              }
            : u
        )
      );
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
    }
  };

  if (loading) {
    return (
      <div className="admin-card">
        <h2 className="admin-card-title">Gestión de Usuarios</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2 className="admin-card-title">Gestión de Usuarios</h2>
        <p className="admin-card-subtitle">
          Administra los usuarios del sistema y sus permisos
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="admin-form-group">
        <div className="admin-filters-row">
          <div className="admin-filters-col">
            <label className="admin-form-label">Buscar usuarios</label>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="admin-filters-col">
            <label className="admin-form-label">Filtrar por rol</label>
            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              className="admin-form-select"
            >
              <option value="todos">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="usuario">Usuarios</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Users2 size={24} />
          </div>
          <div className="admin-stat-value">{usuarios.length}</div>
          <div className="admin-stat-label">Total Usuarios</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Shield size={24} />
          </div>
          <div className="admin-stat-value">{usuarios.filter(u => u.rol === 'admin').length}</div>
          <div className="admin-stat-label">Administradores</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <User size={24} />
          </div>
          <div className="admin-stat-value">{usuarios.filter(u => u.rol === 'usuario').length}</div>
          <div className="admin-stat-label">Usuarios Normales</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="admin-stat-value">{usuarios.filter(u => u.estado === 'activo').length}</div>
          <div className="admin-stat-label">Activos</div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'var(--admin-primary)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {usuario.username.charAt(0).toUpperCase()}
                    </div>
                    <span>{usuario.username}</span>
                  </div>
                </td>
                <td>{usuario.email}</td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: usuario.rol === 'admin' ? 'var(--admin-primary)' : 'var(--admin-secondary)',
                    color: 'white'
                  }}>
                    {usuario.rol === 'admin' ? 'Administrador' : 'Usuario'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleEstado(usuario.id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: usuario.estado === 'activo' ? 'var(--admin-accent)' : 'var(--admin-text-muted)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {usuario.estado}
                  </button>
                </td>
                <td>{new Date(usuario.fecha_creacion).toLocaleDateString('es-ES')}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEditUser(usuario)}
                      className="admin-btn"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      title="Editar usuario"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(usuario.id)}
                      className="admin-btn admin-btn-primary"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: 'var(--admin-secondary)' }}
                      title="Eliminar usuario"
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

      {/* Modal de edición */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Usuario</h3>
            <div className="form-group">
              <label>Usuario:</label>
              <input
                type="text"
                value={editingUser.username}
                onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Rol:</label>
              <select
                value={editingUser.rol}
                onChange={(e) => setEditingUser({...editingUser, rol: e.target.value})}
              >
                <option value="admin">Administrador</option>
                <option value="usuario">Usuario</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estado:</label>
              <select
                value={editingUser.estado}
                onChange={(e) => setEditingUser({...editingUser, estado: e.target.value})}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={handleSaveUser} className="btn-primary">
                Guardar
              </button>
              <button onClick={() => setEditingUser(null)} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
