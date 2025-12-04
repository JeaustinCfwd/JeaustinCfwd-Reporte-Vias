import React, { useState } from 'react';
import { RiDeleteBin5Line } from "react-icons/ri";

const categories = [
  { value: 'bache', label: 'Bache' },
  { value: 'semaforo_danado', label: 'Semáforo dañado' },
  { value: 'senalizacion_deficiente', label: 'Señalización deficiente' },
  { value: 'alcantarilla_danada', label: 'Alcantarilla dañada' },
  { value: 'iluminacion_deficiente', label: 'Iluminación deficiente' },
  { value: 'inundacion', label: 'Inundación' },
  { value: 'derrumbe', label: 'Derrumbe' },
  { value: 'arbol_caido', label: 'Árbol Caído' },
  { value: 'hundimiento_calzada', label: 'Hundimiento de Calzada' },
  { value: 'fuga_agua', label: 'Fuga de Agua' },
  { value: 'cableado_caido', label: 'Cableado Caído' },
  { value: 'obstruccion_via', label: 'Obstrucción de Vía' },
  { value: 'otro', label: 'Otro' },
];

const DBVistaLista = ({
  filteredReports,
  handleUpdateState,
  handleDeleteReport,
  handleUpdateReport
}) => {
  const [editando, setEditando] = useState({ id: null, campo: null });
  const [valorEditado, setValorEditado] = useState('');

  const activarEdicion = (id, campo, valorActual) => {
    setEditando({ id, campo });
    setValorEditado(valorActual || '');
  };

  const guardarEdicion = async () => {
    const { id, campo } = editando;
    if (!id || !campo) return;

    await handleUpdateReport(id, { [campo]: valorEditado });
    setEditando({ id: null, campo: null });
  };

  const cancelarEdicion = () => {
    setEditando({ id: null, campo: null });
    setValorEditado('');
  };

  // Mapear estado ID a nombre
  const getEstadoNombre = (estadoId) => {
    const estados = {
      1: 'nuevo',
      2: 'en_revision',
      3: 'atendido'
    };
    return estados[estadoId] || 'nuevo';
  };

  // Mapear nombre a ID para el backend
  const getEstadoId = (estadoNombre) => {
    const estados = {
      'nuevo': 1,
      'en_revision': 2,
      'atendido': 3
    };
    return estados[estadoNombre] || 1;
  };

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

                {/* Título editable */}
                <td onDoubleClick={() => activarEdicion(report.id, 'titulo', report.titulo)}>
                  {editando.id === report.id && editando.campo === 'titulo' ? (
                    <input
                      value={valorEditado}
                      onChange={(e) => setValorEditado(e.target.value)}
                      onBlur={guardarEdicion}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') guardarEdicion();
                        if (e.key === 'Escape') cancelarEdicion();
                      }}
                      autoFocus
                      className="edit-input"
                    />
                  ) : (
                    <span title="Doble clic para editar">{report.titulo || '-'}</span>
                  )}
                </td>

                {/* Descripción editable */}
                <td onDoubleClick={() => activarEdicion(report.id, 'descripcion', report.descripcion)}>
                  {editando.id === report.id && editando.campo === 'descripcion' ? (
                    <input
                      value={valorEditado}
                      onChange={(e) => setValorEditado(e.target.value)}
                      onBlur={guardarEdicion}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') guardarEdicion();
                        if (e.key === 'Escape') cancelarEdicion();
                      }}
                      autoFocus
                      className="edit-input"
                    />
                  ) : (
                    <span title="Doble clic para editar">{report.descripcion || '-'}</span>
                  )}
                </td>

                {/* Estado con dropdown */}
                <td>
                  <select
                    value={getEstadoNombre(report.estado)}
                    onChange={(e) => handleUpdateState(report.id, getEstadoId(e.target.value))}
                    className="state-select"
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="en_revision">En Revisión</option>
                    <option value="atendido">Atendido</option>
                  </select>
                </td>

                {/* Categoría editable */}
                <td onDoubleClick={() => activarEdicion(report.id, 'categoria', report.categoria)}>
                  {editando.id === report.id && editando.campo === 'categoria' ? (
                    <select
                      value={valorEditado}
                      onChange={(e) => setValorEditado(e.target.value)}
                      onBlur={guardarEdicion}
                      autoFocus
                      className="edit-select"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span title="Doble clic para editar">
                      {categories.find(c => c.value === report.categoria)?.label || report.categoria || '-'}
                    </span>
                  )}
                </td>

                {/* Fecha */}
                <td>
                  {report.fecha_creacion
                    ? new Date(report.fecha_creacion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                    : '-'
                  }
                </td>

                {/* Acciones */}
                <td>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="delete-btn-small"
                    title="Eliminar"
                  >
                    <RiDeleteBin5Line />
                  </button>
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

export default DBVistaLista;