import React, { useState } from "react";
import "../styles/Sidebar.css";
import {
  LayoutDashboard,
  BarChart3,
  Folder,
  Map,
  Download,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

const DBSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeView,
  setActiveView,
  exportToCSV,
}) => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleLogout = () => {
    import('../services/fetch').then(({ logout }) => {
      logout();
      window.location.href = "/login";
    });
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "" : "close"}`}>
      {/* LOGO */}
      <div className="logo-details">
        <LayoutDashboard size={20} />
        <span className="logo_name">Dashboard</span>
      </div>

      <ul className="nav-links">
        {/* RESUMEN GENERAL */}
        <li>
          <a
            onClick={() => {
              console.log('Cambiando a overview, activeView actual:', activeView);
              setActiveView("overview");
            }}
          >
            <BarChart3 size={20} />
            <span className="link_name">Resumen General</span>
          </a>
          <ul className="sub-menu blank">
            <li><a className="link_name">Resumen General</a></li>
          </ul>
        </li>

        {/* REPORTES SUBMENU */}
        <li className={openMenus.reportes ? "showMenu" : ""}>
          <div className="iocn-link">
            <a
              onClick={() => {
                console.log('Cambiando a list, activeView actual:', activeView);
                setActiveView("list");
              }}
            >
              <Folder size={20} />
              <span className="link_name">Reportes</span>
            </a>
            <ChevronDown
              size={16}
              className="arrow"
              onClick={() => toggleMenu("reportes")}
            />
          </div>

          <ul className="sub-menu">
            <li><a className="link_name">Reportes</a></li>
            <li><a>Ver Lista</a></li>
            <li><a>Filtrar</a></li>
            <li><a>Historial</a></li>
          </ul>
        </li>

        {/* MAPA */}
        <li>
          <a
            onClick={() => {
              console.log('Cambiando a map, activeView actual:', activeView);
              setActiveView("map");
            }}
          >
            <Map size={20} />
            <span className="link_name">Mapa Interactivo</span>
          </a>
          <ul className="sub-menu blank">
            <li><a className="link_name">Mapa Interactivo</a></li>
          </ul>
        </li>

        {/* EXPORTAR CSV */}
        <li>
          <a onClick={exportToCSV}>
            <Download size={20} />
            <span className="link_name">Exportar CSV</span>
          </a>
          <ul className="sub-menu blank">
            <li><a className="link_name">Exportar CSV</a></li>
          </ul>
        </li>
      </ul>

      {/* PERFIL */}
      <div className="profile-details">
        <div className="profile-content">
          <div className="profile-avatar">
            <User size={18} />
          </div>
          <div className="name-job">
            <div className="profile_name">Administrador</div>
            <div className="job">Usuario</div>
          </div>
        </div>
        <LogOut 
          size={20}
          onClick={handleLogout}
          className="logout-cursor"
        />
      </div>
    </aside>
  );
};

export default DBSidebar;