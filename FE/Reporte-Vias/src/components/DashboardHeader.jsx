import React from 'react';

const DashboardHeader = ({ 
  filteredReports, 
  reports, 
  searchTerm, 
  setSearchTerm, 
  filterState, 
  setFilterState, 
  filterCategory, 
  setFilterCategory, 
  filterDateFrom, 
  setFilterDateFrom, 
  filterDateTo, 
  setFilterDateTo, 
  clearFilters,
  categories 
}) => {
  return (
    <div className="dashboard-header">
      <div className="header-top">
        <div>
          <h1 className="dashboard-title">Panel de Control</h1>
          <p className="dashboard-subtitle">
            Mostrando {filteredReports.length} de {reports.length} reportes
            <span className="live-indicator">● En vivo</span>
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="🔍 Buscar por título o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
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

        {/* <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)} 
          className="filter-select"
        >
          <option value="all">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
          ))}
        </select> */}

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
      </div>
    </div>
  );
};

export default DashboardHeader;