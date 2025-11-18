export async function loginUser(email, password) {
    // 1. Obtener el token
    const res = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
    });
    const data = await res.json()
    return data
}

// Ejemplo de función protegida con token
export async function obtenerDatosEstadisticos(token) {
    try {
        const res = await fetch('http://localhost:8000/api/crear-reporte/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            if (res.status === 401) {
                console.error("Token expirado o inválido. Necesitas refrescar o reloguear.");
            }
            throw new Error(`Error obteniendo datos: ${res.status}`);
        }

        const reportes = await res.json();
        return reportes;

    } catch (error) {
        console.error('Error obteniendo datos estadísticos:', error);
        return { totalReportes: 0, problemasResueltos: 0, usuariosActivos: 0, promedioDias: '0' };
    }
}

export async function updateUser() { /* ... */ }
export async function registerUser() { /* ... */ }
export async function deleteUser() { /* ... */ }
export async function getUserPhoto() { /* ... */ }
export async function getReviews() { /* ... */ }
export async function postReview() { /* ... */ }
export async function deleteReview() { /* ... */ }