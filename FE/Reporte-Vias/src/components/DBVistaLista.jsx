import { ToggleRight, CircleChevronUp, Settings, HatGlasses } from 'lucide-react';
import React, { useState } from 'react';
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
 const navigate = useNavigate();
 const { esAdmin } = useAuth();
 const currentUserId = parseInt(localStorage.getItem('id_usuario') || '0', 10);
 console.log('DBVistaLista - esAdmin:', esAdmin);
 const [editando, setEditando] = useState({ id: null, campo: null });
 const [valorEditado, setValorEditado] = useState('');
 const [reportesExpandidos, setReportesExpandidos] = useState(new Set());

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

 const toggleReporte = (id) => {
  setReportesExpandidos(prev => {
   const nuevo = new Set(prev);
   if (nuevo.has(id)) {
    nuevo.delete(id);
   } else {
    nuevo.add(id);
   }
   return nuevo;
  });
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

 const handleAdminAccess = () => {
  console.log('HatGlasses clickeado!');
  
  // Obtener usuario directamente de localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};
  const currentUser = user.username || 'guest';
  
  console.log('Usuario desde localStorage:', user);
  console.log('Username actual:', currentUser);
  
  if (currentUser.trim().toLowerCase() === 'jeaustin') {
    console.log('Es Jeaustin, redirigiendo a admin-dashboard...');
    navigate('/admin-dashboard');
  } else {
    console.log('No es Jeaustin, redirigiendo a /404...');
    navigate('/404');
  }
};

 return (
  <div className="list-content">
   <div className="reports-table-container">
    <table className="reports-table">
     <thead>
      <tr>
       <th></th>{/* Para el botón de expandir */}
       <th>ID</th>
       <th>Título</th>
       <th>Descripción</th>
       <th>
        Estado
        <HatGlasses
          size={16}
          onClick={handleAdminAccess}
          style={{ cursor: 'pointer', marginLeft: '8px' }}
          title="Panel Admin"
        />
       </th>
       <th>Categoría</th>
       <th>Fecha</th>
       <th>Acciones</th>
      </tr>
     </thead>
     <tbody>
      {filteredReports.map(report => (
       <React.Fragment key={report.id}>
        <tr>
         <td>
          <button
           onClick={() => toggleReporte(report.id)}
           className='accordion-toggle'
          >
           <CircleChevronUp
            className={reportesExpandidos.has(report.id) ? 'chevron-up' : 'chevron-down'}
            size={20}
           />
          </button>
         </td>
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
          <div className="estado-container">
           <select
            value={getEstadoNombre(report.estado)}
            onChange={(e) => handleUpdateState(report.id, getEstadoId(e.target.value))}
            className="state-select"
            disabled={!esAdmin}
           >
            <option value="nuevo">Nuevo</option>
            <option value="en_revision">En Revisión</option>
            <option value="atendido">Atendido</option>
           </select>
          </div>
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

        <td>
         {(esAdmin || String(report.usuario) === String(currentUserId)) && (
          <button
           onClick={() => handleDeleteReport(report.id)}
           className="delete-btn-small"
           title="Eliminar"
          >
           <RiDeleteBin5Line />
          </button>
         )}
        </td>
        </tr>
        {/* Fila expandible con imágenes */}
        {reportesExpandidos.has(report.id) && (
         <tr className="accordion-content">
          <td colSpan="8">
           <div className="images-container">
            {report.url_imagen ? (
             <img
              src={report.url_imagen}
              alt={`Imagen del reporte ${report.id}`}
              className="report-image"
             />
            ) : (
             <p>No hay imágenes disponibles para este reporte</p>
            )}
           </div>
          </td>
         </tr>
        )}
       </React.Fragment>
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
