 // ==================== COMPONENTE DE FILTROS ====================

 import React from 'react';

 const DBFiltros = ({
     filterState,
     setFilterState,
     filterDateFrom,
     setFilterDateFrom,
     filterDateTo,
     setFilterDateTo,
     clearFilters
 }) => {
     return (
         <>
             <select
                 value={filterState}
                 onChange={(e) => setFilterState(e.target.value)}
                 className="filter-select"
             >
                 <option value="all">Todos los estados</option>
                 <option value="nuevo">Nuevos</option>
                 <option value="en_revision">En Revisión</option>
                 <option value="atendido">Atendidos</option>
             </select>

             <input
                 type="date"
                 value={filterDateFrom}
                 onChange={(e) => setFilterDateFrom(e.target.value)}
                 className="filter-date"
                 placeholder="Desde"
             />

             <input
                 type="date"
                 value={filterDateTo}
                 onChange={(e) => setFilterDateTo(e.target.value)}
                 className="filter-date"
                 placeholder="Hasta"
             />

             <button onClick={clearFilters} className="clear-filters-btn">
                 Limpiar Filtros
             </button>
         </>
     );
 };

 export default DBFiltros;
