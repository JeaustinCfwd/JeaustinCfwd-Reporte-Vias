// ==================== COMPONENTE DE BÚSQUEDA ====================

import React from 'react';

const DBBusqueda = ({ searchTerm, setSearchTerm }) => {
    return (
        <input
            type="text"
            placeholder="🔍 Buscar por título o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
        />
    );
};

export default DBBusqueda;
