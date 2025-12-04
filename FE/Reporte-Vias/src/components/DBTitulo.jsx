// ==================== COMPONENTE DE ENCABEZADO DE TÍTULO ====================

import React from 'react';

const DBTitulo = ({ filteredReports, reports }) => {
    return (
        <div className="header-top">
            <div>
                <h1 className="dashboard-title">Panel de Control</h1>
                <p className="dashboard-subtitle">
                    Mostrando {filteredReports.length} de {reports.length} reportes
                    <span className="live-indicator">● En vivo</span>
                </p>
            </div>
        </div>
    );
};

export default DBTitulo;
