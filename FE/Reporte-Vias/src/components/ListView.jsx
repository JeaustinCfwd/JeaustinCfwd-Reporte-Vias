import React from 'react';

const ListView = ({ 
  filteredReports, 
  handleUpdateState, 
  handleDeleteReport 
}) => {

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
                  <span>{report.titulo}</span>
                </td>
                <td className="description-cell">{report.descripcion}</td>
                <td>
                  <span className={`status-badge ${report.estado}`}>
                    {report.estado}
                  </span>
                </td>
                <td>{report.categoria}</td>
                <td>{report.fecha_creacion ? new Date(report.fecha_creacion).toLocaleDateString('es-ES') : '-'}</td>
                <td>
                  <div className="action-buttons">
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
      </div>
      {filteredReports.length === 0 && (
        <div className="no-results">
          <p>No se encontraron reportes con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
};

export default ListView;