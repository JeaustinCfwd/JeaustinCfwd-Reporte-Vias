import React from 'react';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  BarChart3, 
  LogOut 
} from 'lucide-react';

export const AdminSidebar = ({ activeView, setActiveView, onLogout }) => {
  const menuItems = [
    {
      id: 'reportes',
      label: 'Gestión de Reportes',
      icon: FileText
    },
    {
      id: 'usuarios',
      label: 'Gestión de Usuarios',
      icon: Users
    },
    {
      id: 'comentarios',
      label: 'Moderación de Comentarios',
      icon: MessageSquare
    },
    {
      id: 'estadisticas',
      label: 'Estadísticas',
      icon: BarChart3
    }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <div className="admin-sidebar-logo-icon">
          <BarChart3 size={24} />
        </div>
        <span className="admin-sidebar-logo-text">Panel Admin</span>
      </div>

      <ul className="admin-sidebar-nav">
        {menuItems.map(item => (
          <li key={item.id} className="admin-sidebar-nav-item">
            <a
              href="#"
              className={`admin-sidebar-nav-link ${activeView === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveView(item.id);
              }}
            >
              <item.icon size={20} className="admin-sidebar-nav-icon" />
              <span className="admin-sidebar-nav-text">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="admin-sidebar-profile">
        <a href="#" className="admin-sidebar-profile-link" onClick={(e) => { e.preventDefault(); onLogout(); }}>
          <div className="admin-sidebar-profile-avatar">
            <LogOut size={20} />
          </div>
          <div className="admin-sidebar-profile-info">
            <div className="admin-sidebar-profile-name">Cerrar Sesión</div>
          </div>
        </a>
      </div>
    </aside>
  );
};

export default AdminSidebar;
