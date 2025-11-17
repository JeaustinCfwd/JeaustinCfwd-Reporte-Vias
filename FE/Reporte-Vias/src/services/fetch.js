// Login: obtiene el token JWT y luego los datos del usuario
export async function loginUser(email, password) {
    // 1. Obtener el token
    const res = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Error de login:', res.status, errorData);
        throw new Error(`Login failed: ${res.status}`);
    }
    
    const data = await res.json();
    const token = data.access;

    // 2. Obtener datos del usuario autenticado
    const userRes = await fetch('http://localhost:8000/api/usuarios/me/', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!userRes.ok) {
        console.error('Error obteniendo usuario:', userRes.status);
        throw new Error('Failed to fetch user data');
    }
    
    const user = await userRes.json();

    return { user, token };
}

// Ejemplo de función protegida con token
export async function obtenerDatosEstadisticos(token) {
    try {
        const res = await fetch('http://localhost:8000/api/reportes/', {
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

// Si tienes otras funciones, agrégalas así:
export async function updateUser() { /* ... */ }
export async function registerUser() { /* ... */ }
export async function deleteUser() { /* ... */ }
export async function getUserPhoto() { /* ... */ }
export async function getReviews() { /* ... */ }
export async function postReview() { /* ... */ }
export async function deleteReview() { /* ... */ }