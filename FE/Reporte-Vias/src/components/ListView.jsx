import React from 'react';
import { useNavigate } from 'react-router-dom';

const ListView = ({ 
  filteredReports, 
  handleUpdateState, 
  handleDeleteReport 
}) => {
  const navigate = useNavigate();

  return (
    <div className="list-content">
      <div className="reports-table-container">
        <table className="reports-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Categoría</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map(report => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>
                  <button 
                    onClick={() => navigate(`/report/${report.id}`)}
                    className="report-title-link"
                    title="Ver detalles"
                  >
                    {report.title}
                  </button>
                </td>
                <td className="description-cell">{report.description}</td>
                <td>
                  <span className={`status-badge ${report.state}`}>
                    {report.state?.replace(/_/g, ' ')}
                  </span>
                </td>
                <td>{report.category?.replace(/_/g, ' ')}</td>
                <td>{report.timestamp ? new Date(report.timestamp).toLocaleDateString('es-ES') : '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => navigate(`/report/${report.id}`)}
                      className="view-btn-small"
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    <select 
                      value={report.state} 
                      onChange={(e) => handleUpdateState(report.id, e.target.value)}
                      className="state-select"
                    >
                      <option value="nuevo">Nuevo</option>
                      <option value="en_revision">En Revisión</option>
                      <option value="atendido">Atendido</option>
                    </select>
                    <button 
                      onClick={() => handleDeleteReport(report.id)}
                      className="delete-btn-small"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredReports.length === 0 && (
          <div className="no-results">
            <p>No se encontraron reportes con los filtros aplicados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;