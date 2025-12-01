import React, { useState } from "react";
import "../styles/Sidebar.css";

const DashboardSidebar = ({
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

  return (
    <aside className={`sidebar ${sidebarOpen ? "" : "close"}`}>
      {/* LOGO */}
      <div className="logo-details">
        <i className="bx bx-grid-alt"></i>
        <span className="logo_name">ReporteVías CR</span>
      </div>

      <ul className="nav-links">
        {/* RESUMEN GENERAL */}
        <li>
          <a 
            onClick={() => setActiveView("overview")}
            className={activeView === "overview" ? "active" : ""}
          >
            <i className="bx bx-stats"></i>
            <span className="link_name">Resumen General</span>
          </a>
          <ul className="sub-menu blank">
            <li><a className="link_name">Resumen General</a></li>
          </ul>
        </li>

        {/* REPORTES SUBMENU */}
        <li className={openMenus.reportes ? "showMenu" : ""}>
          <div className="iocn-link">
            <a onClick={() => setActiveView("list")}>
              <i className="bx bx-folder"></i>
              <span className="link_name">Reportes</span>
            </a>
            <i
              className="bx bxs-chevron-down arrow"
              onClick={() => toggleMenu("reportes")}
            ></i>
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
            onClick={() => setActiveView("map")}
            className={activeView === "map" ? "active" : ""}
          >
            <i className="bx bx-map"></i>
            <span className="link_name">Mapa Interactivo</span>
          </a>
          <ul className="sub-menu blank">
            <li><a className="link_name">Mapa Interactivo</a></li>
          </ul>
        </li>

        {/* ESTADISTICAS SUBMENU */}
        <li className={openMenus.stats ? "showMenu" : ""}>
          <div className="iocn-link">
            <a onClick={() => setActiveView("stats")}>
              <i className="bx bx-line-chart"></i>
              <span className="link_name">Estadísticas</span>
            </a>
            <i
              className="bx bxs-chevron-down arrow"
              onClick={() => toggleMenu("stats")}
            ></i>
          </div>

          <ul className="sub-menu">
            <li><a className="link_name">Estadísticas</a></li>
            <li><a>Resumen</a></li>
            <li><a>Categorías</a></li>
            <li><a>Estados</a></li>
          </ul>
        </li>

        {/* EXPORTAR CSV */}
        <li>
          <a onClick={exportToCSV}>
            <i className="bx bx-download"></i>
            <span className="link_name">Exportar CSV</span>
          </a>
          <ul className="sub-menu blank">
            <li><a className="link_name">Exportar CSV</a></li>
          </ul>
        </li>

        {/* PERFIL */}
        <li>
          <div className="profile-details">
            <div className="profile-content">
              <img src="/profile.jpg" alt="profileImg" />
            </div>

            <div className="name-job">
              <div className="profile_name">Administrador</div>
              <div className="job">Usuario</div>
            </div>

            <i className="bx bx-log-out"></i>
          </div>
        </li>
      </ul>
    </aside>
  );
};

export default DashboardSidebar;