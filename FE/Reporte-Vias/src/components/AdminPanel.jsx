import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminReportes } from './AdminReportes';
// import { AdminUsuarios } from './AdminUsuarios';
// import { AdminComentarios } from './AdminComentarios';
import '../styles/Dashboard.css';

export const PanelAdmin = () => {
  const [vistaActiva, setVistaActiva] = useState('reportes');

  const renderContenido = () => {
    switch (vistaActiva) {
      case 'reportes':
        return <AdminReportes />;
      case 'usuarios':
        return <AdminUsuarios />;
      case 'comentarios':
        return <AdminComentarios />;
      default:
        return <AdminReportes />;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <AdminSidebar 
        vistaActiva={vistaActiva} 
        setVistaActiva={setVistaActiva} 
      />
      <main className="dashboard-main">
        {renderContenido()}
      </main>
    </div>
  );
};

export default PanelAdmin;
