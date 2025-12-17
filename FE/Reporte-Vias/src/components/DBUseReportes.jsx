// ==================== HOOK DE REPORTES ====================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../services/fetch';

export const useReportes = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Definir fetchReports fuera del useEffect para poder usarla en el return
    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth('http://localhost:8000/api/crear-reporte/', {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                }
            });

            if (!res.ok) throw new Error(`Error fetching reports: ${res.status}`);

            const data = await res.json();
            const reportsData = Array.isArray(data) ? data : (data.results || []);
            setReports(reportsData);
            setFilteredReports(reportsData);
        } catch (err) {
            setError(err.message);
            const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
            setReports(storedReports);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // Fetch inicial de reportes
    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    return {
        reports,
        setReports,
        loading,
        error,
        filteredReports,
        setFilteredReports,
        refreshReports: fetchReports
    };
};
