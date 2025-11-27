import React, { useState } from "react";
import "../styles/Dashboard.css";

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
      {/* HEADER / LOGO */}
      <div className="logo-details">
        <i className="bx bx-grid-alt"></i>
        <span className="logo_name">Dashboard</span>
      </div>

      <ul className="nav-links">
        {/* ---------------------------
              OPCIÓN 1: RESUMEN GENERAL
        ---------------------------- */}
        <li>
          <a onClick={() => setActiveView("overview")}>
            <i className="bx bx-stats"></i>
            <span className="link_name">Resumen General</span>
          </a>
        </li>

        {/* ---------------------------
              OPCIÓN 2: REPORTES (SUBMENÚ)
        ---------------------------- */}
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
            <li><a>Ver Lista</a></li>
            <li><a>Filtrar</a></li>
            <li><a>Historial</a></li>
          </ul>
        </li>

        {/* ---------------------------
              MAPA
        ---------------------------- */}
        <li>
          <a onClick={() => setActiveView("map")}>
            <i className="bx bx-map"></i>
            <span className="link_name">Mapa Interactivo</span>
          </a>
        </li>

        {/* ---------------------------
              ESTADÍSTICAS (SUBMENÚ)
        ---------------------------- */}
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
            <li><a>Resumen</a></li>
            <li><a>Categorías</a></li>
            <li><a>Estados</a></li>
          </ul>
        </li>

        {/* ---------------------------
              EXPORTAR
        ---------------------------- */}
        <li>
          <a onClick={exportToCSV}>
            <i className="bx bx-download"></i>
            <span className="link_name">Exportar CSV</span>
          </a>
        </li>

        {/* PERFIL (OPCIONAL) */}
        <li>
          <div className="profile-details">
            <div className="profile-content">
              <img
                src="/profile.jpg"
                alt="profileImg"
              />
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