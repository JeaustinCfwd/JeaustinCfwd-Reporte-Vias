// ==================== CONSTANTES DEL DASHBOARD ====================

export const STATE_COLORS = {
    nuevo: { bg: 'rgba(252, 129, 129, 0.8)', border: 'rgba(252, 129, 129, 1)' },
    en_revision: { bg: 'rgba(90, 103, 216, 0.8)', border: 'rgba(90, 103, 216, 1)' },
    atendido: { bg: 'rgba(72, 187, 120, 0.8)', border: 'rgba(72, 187, 120, 1)' }
};

export const CATEGORY_PALETTE = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

export const CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                color: '#FFFFFF',
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#FFFFFF',
                font: {
                    size: 11
                }
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)'
            }
        },
        y: {
            ticks: {
                color: '#FFFFFF',
                font: {
                    size: 11
                }
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)'
            }
        }
    }
};
