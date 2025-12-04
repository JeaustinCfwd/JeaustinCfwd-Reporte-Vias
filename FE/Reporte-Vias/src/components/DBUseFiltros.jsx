// ==================== HOOK DE FILTROS ====================

import { useState } from 'react';

export const useFiltros = () => {
    const [filterState, setFilterState] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const clearFilters = () => {
        setFilterState('all');
        setFilterCategory('all');
        setFilterDateFrom('');
        setFilterDateTo('');
        setSearchTerm('');
    };

    return {
        filterState,
        setFilterState,
        filterCategory,
        setFilterCategory,
        filterDateFrom,
        setFilterDateFrom,
        filterDateTo,
        setFilterDateTo,
        searchTerm,
        setSearchTerm,
        clearFilters
    };
};
