// ==================== HOOK DE ESTADÍSTICAS ====================

import { useMemo } from 'react';
import { STATE_COLORS, CATEGORY_PALETTE } from './DBConstantes';

export const useEstadisticas = (filteredReports, reports) => {
    // Estadísticas por estado
    const statsByState = useMemo(() => {
        return filteredReports.reduce((acc, report) => {
            acc[report.state] = (acc[report.state] || 0) + 1;
            return acc;
        }, {});
    }, [filteredReports]);

    // Estadísticas por categoría
    const statsByCategory = useMemo(() => {
        return filteredReports.reduce((acc, report) => {
            const cat = (report.category || 'Sin Categoría').replace(/_/g, ' ');
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});
    }, [filteredReports]);

    // Categorías únicas
    const categories = useMemo(() => {
        const cats = new Set(reports.map(r => r.category));
        return Array.from(cats);
    }, [reports]);

    // Datos para gráfico de estados
    const stateData = useMemo(() => ({
        labels: ['Nuevos', 'En Revisión', 'Atendidos'],
        datasets: [{
            label: 'Número de Reportes',
            data: [
                statsByState.nuevo || 0,
                statsByState.en_revision || 0,
                statsByState.atendido || 0
            ],
            backgroundColor: [
                STATE_COLORS.nuevo.bg,
                STATE_COLORS.en_revision.bg,
                STATE_COLORS.atendido.bg
            ],
            borderColor: [
                STATE_COLORS.nuevo.border,
                STATE_COLORS.en_revision.border,
                STATE_COLORS.atendido.border
            ],
            borderWidth: 1
        }]
    }), [statsByState]);

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
            return filteredReports.filter(r =>
                r.timestamp && r.timestamp.split('T')[0] === date
            ).length;
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
    }, [filteredReports]);

    return {
        statsByState,
        statsByCategory,
        categories,
        stateData,
        categoryData,
        timelineData
    };
};
