import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Edit, Trash2, Shield, User } from 'lucide-react';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('todos');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    // Simulación de carga de datos
    setTimeout(() => {
      setUsuarios([
        {
          id: 1,
          username: 'Jeaustin',
          email: 'jeaustincalu873@gmail.com',
          rol: 'admin',
          fecha_creacion: '2023-01-15',
          estado: 'activo'
        },
        {
          id: 2,
          username: 'usuario1',
          email: 'usuario1@example.com',
          rol: 'usuario',
          fecha_creacion: '2023-02-20',
          estado: 'activo'
        },
        {
          id: 3,
          username: 'usuario2',
          email: 'usuario2@example.com',
          rol: 'usuario',
          fecha_creacion: '2023-03-10',
          estado: 'inactivo'
        }
      ]);
      setLoading(false);
    }, 1000);
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

  const handleSaveUser = () => {
    // Lógica para guardar cambios
    setUsuarios(prev => prev.map(u => 
      u.id === editingUser.id ? editingUser : u
    ));
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      setUsuarios(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleToggleEstado = (userId) => {
    setUsuarios(prev => prev.map(u => 
      u.id === userId ? { ...u, estado: u.estado === 'activo' ? 'inactivo' : 'activo' } : u
    ));
  };

  if (loading) {
    return (
      <div className="overview-content">
        <h2 className="dashboard-title">Gestión de Usuarios</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-content">
      <div className="admin-header">
        <h2 className="dashboard-title">Gestión de Usuarios</h2>
        <p className="dashboard-subtitle">
          Administra los usuarios del sistema y sus permisos
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="admin-filters">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <Filter size={20} className="filter-icon" />
          <select
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="usuario">Usuarios</option>
          </select>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{usuarios.length}</h3>
            <p>Total Usuarios</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon admin">
            <Shield size={24} />
          </div>
          <div className="stat-content">
            <h3>{usuarios.filter(u => u.rol === 'admin').length}</h3>
            <p>Administradores</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon user">
            <User size={24} />
          </div>
          <div className="stat-content">
            <h3>{usuarios.filter(u => u.rol === 'usuario').length}</h3>
            <p>Usuarios Normales</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon active">
            <div className="status-dot active"></div>
          </div>
          <div className="stat-content">
            <h3>{usuarios.filter(u => u.estado === 'activo').length}</h3>
            <p>Activos</p>
          </div>
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
                  <div className="user-info">
                    <div className="user-avatar">
                      {usuario.username.charAt(0).toUpperCase()}
                    </div>
                    <span>{usuario.username}</span>
                  </div>
                </td>
                <td>{usuario.email}</td>
                <td>
                  <span className={`rol-badge ${usuario.rol}`}>
                    {usuario.rol === 'admin' ? (
                      <>
                        <Shield size={14} />
                        Administrador
                      </>
                    ) : (
                      <>
                        <User size={14} />
                        Usuario
                      </>
                    )}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleEstado(usuario.id)}
                    className={`status-toggle ${usuario.estado}`}
                  >
                    <span className="status-dot"></span>
                    {usuario.estado}
                  </button>
                </td>
                <td>{new Date(usuario.fecha_creacion).toLocaleDateString('es-ES')}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEditUser(usuario)}
                      className="btn-edit"
                      title="Editar usuario"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(usuario.id)}
                      className="btn-delete"
                      title="Eliminar usuario"
                    >
                      <Trash2 size={16} />
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
