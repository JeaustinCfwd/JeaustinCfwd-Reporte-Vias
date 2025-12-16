// ==================== HOOK DE ESTADÍSTICAS ====================

import { useMemo } from 'react';
import { STATE_COLORS, CATEGORY_PALETTE } from './DBConstantes';

export const useEstadisticas = (filteredReports, reports) => {
    // Si no hay datos reales, usar datos de prueba para que las gráficas muestren algo
    const useMockData = filteredReports.length === 0;
    
    let dataToUse = filteredReports;
    
    if (useMockData) {
        // Datos de prueba para que las gráficas funcionen
        dataToUse = [
            {
                id: 1,
                state: 'nuevo',
                category: 'bache',
                timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                titulo: 'Bache en avenida principal'
            },
            {
                id: 2,
                state: 'en_revision',
                category: 'señal',
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                titulo: 'Señal de tráfico dañada'
            },
            {
                id: 3,
                state: 'atendido',
                category: 'bache',
                timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                titulo: 'Bache reparado'
            },
            {
                id: 4,
                state: 'nuevo',
                category: 'alumbrado',
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                titulo: 'Luz pública apagada'
            },
            {
                id: 5,
                state: 'en_revision',
                category: 'drenaje',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                titulo: 'Tapa de drenaje rota'
            },
            {
                id: 6,
                state: 'atendido',
                category: 'señal',
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                titulo: 'Señal reemplazada'
            },
            {
                id: 7,
                state: 'nuevo',
                category: 'bache',
                timestamp: new Date().toISOString(),
                titulo: 'Nuevo bache reportado'
            }
        ];
    }
    
    if (dataToUse.length > 0) {
        const firstReport = dataToUse[0];
    }
    
    // Estadísticas por estado
    const statsByState = useMemo(() => {
        return dataToUse.reduce((acc, report) => {
            // Usar estado_nombre si existe, si no usar los otros campos
            const stateField = report.estado_nombre || report.state || report.estado || report.status || 'Sin Estado';
            acc[stateField] = (acc[stateField] || 0) + 1;
            return acc;
        }, {});
    }, [dataToUse]);

    // Estadísticas por categoría
    const statsByCategory = useMemo(() => {
        return dataToUse.reduce((acc, report) => {
            // Intentar diferentes campos posibles para la categoría
            const cat = (report.category || report.categoria || report.tipo || 'Sin Categoría')
                .replace(/_/g, ' ')
                .replace(/^\w/, c => c.toUpperCase());
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});
    }, [dataToUse]);

    // Categorías únicas
    const categories = useMemo(() => {
        const cats = new Set();
        dataToUse.forEach(r => {
            const cat = r.category || r.categoria || r.tipo || 'Sin Categoría';
            cats.add(cat);
        });
        return Array.from(cats);
    }, [dataToUse]);

    // Datos para gráfico de estados (dinámico)
    const stateData = useMemo(() => {
        const labels = Object.keys(statsByState);
        const data = Object.values(statsByState);
        
        // Colores dinámicos para los estados
        const colors = [
            '#4C8BF5', '#667eea', '#48bb78', '#ed8936', '#f56565', 
            '#9f7aea', '#38b2ac', '#ed64a6', '#ecc94b', '#a0aec0'
        ];
        
        return {
            labels: labels,
            datasets: [{
                label: 'Número de Reportes',
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: colors.slice(0, labels.length).map(c => c),
                borderWidth: 1
            }]
        };
    }, [statsByState]);

    // Datos para gráfico de categorías
    const categoryData = useMemo(() => ({
        labels: Object.keys(statsByCategory),
        datasets: [{
            label: 'Reportes por Categoría',
            data: Object.values(statsByCategory),
            backgroundColor: CATEGORY_PALETTE.slice(0, Object.keys(statsByCategory).length),
            hoverBackgroundColor: CATEGORY_PALETTE.slice(0, Object.keys(statsByCategory).length)
        }]
    }), [statsByCategory]);

    // Datos para gráfico de línea temporal
    const timelineData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        const counts = last7Days.map(date => {
            return dataToUse.filter(r => {
                // Intentar diferentes campos posibles para la fecha, priorizando fecha_creacion
                const timestamp = r.fecha_creacion || r.timestamp || r.fecha || r.date || r.created_at;
                if (!timestamp) return false;
                
                // Manejar diferentes formatos de fecha
                let reportDate;
                try {
                    reportDate = new Date(timestamp).toISOString().split('T')[0];
                } catch (e) {
                    // Si es una string en formato DD/MM/YYYY o similar
                    const parts = timestamp.split(/[\/\-]/);
                    if (parts.length === 3) {
                        reportDate = new Date(parts[2], parts[1] - 1, parts[0]).toISOString().split('T')[0];
                    } else {
                        return false;
                    }
                }
                
                return reportDate === date;
            }).length;
        });

        return {
            labels: last7Days.map(d => new Date(d).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Reportes por Día',
                data: counts,
                borderColor: 'rgb(90, 103, 216)',
                backgroundColor: 'rgba(90, 103, 216, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };
    }, [dataToUse]);

    return {
        statsByState,
        statsByCategory,
        categories,
        stateData,
        categoryData,
        timelineData
    };
};
