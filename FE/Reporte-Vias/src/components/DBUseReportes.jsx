// ==================== HOOK DE REPORTES ====================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useReportes = () => {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filteredReports, setFilteredReports] = useState([]);

    // Fetch inicial de reportes
    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:8000/api/crear-reporte/', {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                });

                if (res.status === 401) {
                    setError('No autorizado. Por favor inicia sesión.');
                    navigate('/login');
                    return;
                }

                if (!res.ok) throw new Error(`Error fetching reports: ${res.status}`);

                const data = await res.json();
                const reportsData = Array.isArray(data) ? data : (data.results || []);
                setReports(reportsData);
            } catch (err) {
                setError(err.message);
                const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
                setReports(storedReports);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
        const interval = setInterval(fetchReports, 30000);
        return () => clearInterval(interval);
    }, [navigate]);

    // Traer reportes filtrados
    useEffect(() => {
        const traerReportes = async () => {
            const reports = await fetch(`http://127.0.0.1:8000/api/crear-reporte/`);
            const data = await reports.json();
            setFilteredReports(data);
            console.log(data);
        };
        traerReportes();
    }, []);

    return {
        reports,
        setReports,
        loading,
        error,
        filteredReports,
        setFilteredReports
    };
};
