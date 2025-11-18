import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

const StatsView = ({ 
  reports, 
  filteredReports, 
  statsByState, 
  statsByCategory, 
  stateData, 
  categoryData, 
  CHART_OPTIONS 
}) => {
  return (
    <div className="stats-content">
      <div className="stats-grid">
        <div className="stat-detail-card">
          <h3>Métricas Generales</h3>
          <div className="metric-row">
            <span>Total de Reportes:</span>
            <strong>{reports.length}</strong>
          </div>
          <div className="metric-row">
            <span>Reportes Filtrados:</span>
            <strong>{filteredReports.length}</strong>
          </div>
          <div className="metric-row">
            <span>Tasa de Atención:</span>
            <strong>
              {reports.length > 0 
                ? ((statsByState.atendido || 0) / reports.length * 100).toFixed(1) 
                : 0}%
            </strong>
          </div>
          <div className="metric-row">
            <span>Pendientes:</span>
            <strong>{(statsByState.nuevo || 0) + (statsByState.en_revision || 0)}</strong>
          </div>
        </div>

        <div className="stat-detail-card">
          <h3>Por Estado</h3>
          <div className="metric-row">
            <span>🆕 Nuevos:</span>
            <strong className="orange">{statsByState.nuevo || 0}</strong>
          </div>
          <div className="metric-row">
            <span>🔍 En Revisión:</span>
            <strong className="blue">{statsByState.en_revision || 0}</strong>
          </div>
          <div className="metric-row">
            <span>✅ Atendidos:</span>
            <strong className="green">{statsByState.atendido || 0}</strong>
          </div>
        </div>

        <div className="stat-detail-card">
          <h3>Por Categoría</h3>
          {Object.entries(statsByCategory).map(([cat, count]) => (
            <div key={cat} className="metric-row">
              <span>{cat}:</span>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <h2>Reportes por Estado</h2>
          <div className="chart-wrapper">
            <Bar data={stateData} options={CHART_OPTIONS} />
          </div>
        </div>
        <div className="chart-container">
          <h2>Reportes por Categoría</h2>
          <div className="chart-wrapper">
            <Pie data={categoryData} options={CHART_OPTIONS} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsView;