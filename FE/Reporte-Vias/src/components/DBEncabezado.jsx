import React from 'react';
import DBTitulo from './DBTitulo';
import DBBusqueda from './DBBusqueda';
import DBFiltros from './DBFiltros';

const DBEncabezado = ({
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
            <DBTitulo filteredReports={filteredReports} reports={reports} />

            {/* Filtros */}
            <div className="filters-container">
                <DBBusqueda searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                <DBFiltros
                    filterState={filterState}
                    setFilterState={setFilterState}
                    filterDateFrom={filterDateFrom}
                    setFilterDateFrom={setFilterDateFrom}
                    filterDateTo={filterDateTo}
                    setFilterDateTo={setFilterDateTo}
                    clearFilters={clearFilters}
                />
            </div>
        </div>
    );
};

export default DBEncabezado;
