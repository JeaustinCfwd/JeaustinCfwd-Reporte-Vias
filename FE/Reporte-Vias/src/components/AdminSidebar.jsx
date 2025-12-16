import React from 'react';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  BarChart3, 
  LogOut 
} from 'lucide-react';

export const AdminSidebar = ({ vistaActiva, setVistaActiva }) => {
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

  const handleLogout = () => {
    import('../services/fetch').then(({ logout }) => {
      logout();
      window.location.href = '/login';
    });
  };

  return (
    <aside className="sidebar">
      <div className="logo-details">
        <BarChart3 size={24} />
        <span className="logo_name">Panel Admin</span>
      </div>

      <ul className="nav-links">
        {menuItems.map(item => (
          <li key={item.id}>
            <a
              href="#"
              className={vistaActiva === item.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setVistaActiva(item.id);
              }}
            >
              <item.icon size={20} />
              <span className="link_name">{item.label}</span>
            </a>
            <ul className="sub-menu blank">
              <li><a className="link_name">{item.label}</a></li>
            </ul>
          </li>
        ))}
      </ul>

      <div className="profile-details">
        <div className="profile-content">
          <LogOut
            size={20}
            onClick={handleLogout}
            className="logout-cursor"
          />
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
