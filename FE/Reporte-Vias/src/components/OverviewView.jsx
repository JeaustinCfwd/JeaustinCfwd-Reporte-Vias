import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';

const OverviewView = ({ 
  filteredReports, 
  statsByState, 
  timelineData, 
  stateData, 
  categoryData, 
  CHART_OPTIONS 
}) => {
  return (
    <div className="overview-content">
      {/* Tarjetas de estadísticas */}
      <div className="dashboard-stats">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Total de Reportes</h3>
            <p className="stat-number">{filteredReports.length}</p>
          </div>
        </div>
        <div className="stat-card nuevo">
          <div className="stat-icon">🆕</div>
          <div className="stat-info">
            <h3>Nuevos</h3>
            <p className="stat-number">{statsByState.nuevo || 0}</p>
          </div>
        </div>
        <div className="stat-card revision">
          <div className="stat-icon">🔍</div>
          <div className="stat-info">
            <h3>En Revisión</h3>
            <p className="stat-number">{statsByState.en_revision || 0}</p>
          </div>
        </div>
        <div className="stat-card atendido">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Atendidos</h3>
            <p className="stat-number">{statsByState.atendido || 0}</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="dashboard-charts">
        <div className="chart-container">
          <h2>Tendencia de Reportes (Últimos 7 días)</h2>
          <div className="chart-wrapper">
            <Line data={timelineData} options={CHART_OPTIONS} />
          </div>
        </div>
        <div className="chart-container">
          <h2>Distribución por Estado</h2>
          <div className="chart-wrapper">
            <Bar data={stateData} options={CHART_OPTIONS} />
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
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

export default OverviewView;