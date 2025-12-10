import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { FcBarChart, FcOpenedFolder, FcAbout } from "react-icons/fc";
import { GiMagnifyingGlass } from "react-icons/gi";

const DBVistaResumen = ({
  filteredReports,
  statsByState,
  statsByCategory,
  timelineData,
  stateData,
  categoryData,
  CHART_OPTIONS,
  reports
}) => {
  return (
    <div className="overview-content">

      {/* Tarjetas de estadísticas combinadas */}
      <div className="dashboard-stats">

        {/* === TOTAL DE REPORTES (clase original) === */}
        <div className="stat-card-container stat-card-highlight">
          <div className="stat-card-ellipse"></div>
          <div className="stat-card-bg"></div>
          <div className="stat-card-glass"></div>

          <div className="stat-card-desc"><FcBarChart /></div>
          <div className="stat-card-title">Total de Reportes</div>
          <div className="stat-card-value">{reports.length}</div>
        </div>

        {/* === NUEVOS (clase individual nueva) === */}
        <div className="stat-card-container stat-card-new">
          <div className="stat-card-ellipse"></div>
          <div className="stat-card-bg"></div>
          <div className="stat-card-glass"></div>

          <div className="stat-card-desc"><FcOpenedFolder /></div>
          <div className="stat-card-title">Nuevos</div>
          <div className="stat-card-value">{statsByState.nuevo || 0}</div>
        </div>

        {/* === EN REVISIÓN (clase individual nueva) === */}
        <div className="stat-card-container stat-card-review">
          <div className="stat-card-ellipse"></div>
          <div className="stat-card-bg"></div>
          <div className="stat-card-glass"></div>

          <div className="stat-card-desc"><GiMagnifyingGlass /></div>
          <div className="stat-card-title">En Revisión</div>
          <div className="stat-card-value">{statsByState.en_revision || 0}</div>
        </div>

        {/* === ATENDIDOS (clase individual nueva) === */}
        <div className="stat-card-container stat-card-attended">
          <div className="stat-card-ellipse"></div>
          <div className="stat-card-bg"></div>
          <div className="stat-card-glass"></div>

          <div className="stat-card-desc"><FcAbout /></div>
          <div className="stat-card-title">Atendidos</div>
          <div className="stat-card-value">{statsByState.atendido || 0}</div>
        </div>

      </div>

      {/* Grid de métricas detalladas */}
      <div className="stats-grid">

        {/* Métricas Generales */}
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
            <strong>
              {(statsByState.nuevo || 0) + (statsByState.en_revision || 0)}
            </strong>
          </div>

          <div className="metric-row">
            <span>Sin Categoría:</span>
            <strong>{statsByCategory['Sin Categoría'] || 0}</strong>
          </div>
        </div>


      </div>

      {/* Gráficos */}
      <div className="dashboard-charts">
        <div className="stat-detail-card trend-chart">
          <h2>Tendencia de Reportes (Últimos 7 días)</h2>
          <div className="chart-wrapper">
            <Line data={timelineData} options={CHART_OPTIONS} />
          </div>
        </div>

        <div className="stat-detail-card state-chart">
          <h2>Distribución por Estado</h2>
          <div className="chart-wrapper">
            <Bar data={stateData} options={CHART_OPTIONS} />
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="stat-detail-card category-chart">
          <h2>Reportes por Categoría</h2>
          <div className="chart-wrapper">
            <Pie data={categoryData} options={CHART_OPTIONS} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default DBVistaResumen;
