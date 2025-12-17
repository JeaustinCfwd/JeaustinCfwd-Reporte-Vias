// ==================== HOOK DE ACCIONES ====================

import { useCallback } from 'react';
import { useToast } from './ToastContext';
import { fetchWithAuth } from '../services/fetch';

export const useAcciones = (reports, setReports, filteredReports, refreshReports) => {
    const { success, error: showError } = useToast();

    // Eliminar reporte
    const handleDeleteReport = useCallback(async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este reporte?')) return;

        try {
            const res = await fetchWithAuth(`http://localhost:8000/api/eliminar-reporte/${id}/`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error(`Error deleting report: ${res.status}`);

            setReports(reports.filter(report => String(report.id) !== String(id)));
            success('Reporte eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting report:', error);
            showError('Error al eliminar el reporte');
        }
    }, [reports, success, showError, setReports]);

    // Actualizar estado del reporte
    const handleUpdateState = useCallback(async (id, newEstadoId) => {
        try {
            const res = await fetchWithAuth(`http://localhost:8000/api/editar-reporte/${id}/`, {
                method: 'PATCH',
                body: JSON.stringify({ estado: newEstadoId })
            });

            if (!res.ok) throw new Error(`Error updating report: ${res.status}`);

            const updatedReport = await res.json();
            setReports(reports.map(report =>
                String(report.id) === String(id) ? updatedReport : report
            ));
            success('Estado actualizado correctamente');

            // Actualizar los datos para reflejar los cambios en las gráficas
            if (refreshReports) {
                refreshReports();
            }
        } catch (error) {
            console.error('Error updating report state:', error);
            showError('Error al actualizar el estado');
        }
    }, [reports, success, showError, setReports, refreshReports]);

    // Actualizar reporte completo
    const handleUpdateReport = useCallback(async (id, updates) => {
        try {
            const res = await fetchWithAuth(`http://localhost:8000/api/editar-reporte/${id}/`, {
                method: 'PATCH',
                body: JSON.stringify(updates)
            });

            if (!res.ok) throw new Error(`Error updating report: ${res.status}`);

            const updatedReport = await res.json();
            setReports(reports.map(report =>
                String(report.id) === String(id) ? { ...report, ...updatedReport } : report
            ));
            success('Reporte actualizado correctamente');
            if (refreshReports) {
                await refreshReports();
            }
        } catch (error) {
            console.error('Error updating report:', error);
            showError('Error al actualizar el reporte');
        }
    }, [reports, success, showError, setReports, refreshReports]);

    // Exportar a CSV
    const exportToCSV = useCallback(() => {
        try {
            const headers = ['ID', 'Título', 'Descripción', 'Estado', 'Categoría', 'Latitud', 'Longitud', 'Fecha'];
            const rows = filteredReports.map(r => [
                r.id,
                r.titulo || '',
                r.descripcion || '',
                r.estado || '',
                r.categoria || '',
                r.latitud || '',
                r.longitud || '',
                r.fecha_creacion ? new Date(r.fecha_creacion).toLocaleString('es-ES') : ''
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            ].join('\n');

            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `reportes_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            success('Archivo CSV descargado exitosamente');
        } catch (error) {
            showError('Error al exportar el archivo CSV');
        }
    }, [filteredReports, success, showError]);

    return {
        handleDeleteReport,
        handleUpdateState,
        handleUpdateReport,
        exportToCSV
    };
};
