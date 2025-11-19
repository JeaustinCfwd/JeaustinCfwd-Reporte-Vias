// services/fetch.js
const API_URL = 'http://localhost:8000/api/';

// 1. Función de Login
export async function loginUser(email, password) {
    const res = await fetch(API_URL + 'login/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
            username: email, // El backend espera 'username'
            password: password 
        }),
        credentials: 'include', // **AGREGADO: Manejo de cookies de sesión**
    });

    if (!res.ok) {
        // **AGREGADO: Manejo de errores**
        const errorData = await res.json();
        throw new Error(errorData.mensaje || 'Error de inicio de sesión');
    }
    
    const data = await res.json();
    return data;
}

// 2. Función de Registro de Usuario (Implementada)
export async function registerUser(userData) {
    // userData debe tener los campos: username, first_name, last_name, email, password, rol
    
    const res = await fetch(API_URL + 'crear-user/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(userData),
        credentials: 'include', // **AGREGADO: Manejo de cookies de sesión**
    });
    
    if (!res.ok) {
        // **AGREGADO: Manejo de errores**
        const errorData = await res.json();
        console.error("Error en registerUser:", errorData);
        throw new Error(errorData.error || 'Error desconocido al registrar');
    }

    const data = await res.json();
    return data;
}


// 3. Ejemplo de función protegida (Usando fetch y la cookie de sesión/futuro JWT)
export async function obtenerDatosEstadisticos() {
    // NOTA: Si usas sesiones/cookies, NO necesitas el token en el header.
    // El browser envía la cookie automáticamente si tienes credentials: 'include'.
    // Si más adelante usas JWT (como pide la rúbrica), descomentarás el header de Auth.
    
    try {
        const res = await fetch(API_URL + 'crear-reporte/', {
            method: 'GET',
            credentials: 'include', // Envía la cookie de sesión automáticamente
            // headers: { 'Authorization': `Bearer ${token}` } // Usar para JWT después
        });

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                console.error("Sesión expirada o no autorizada.");
            }
            throw new Error(`Error obteniendo datos: ${res.status}`);
        }

        const reportes = await res.json();
        return reportes;

    } catch (error) {
        console.error('Error obteniendo datos estadísticos:', error);
        throw error; // Relanza el error para que el componente lo maneje
    }
}


export async function updateUser() { /* ... */ }
export async function deleteUser() { /* ... */ }
export async function getUserPhoto() { /* ... */ }
export async function getReviews() { /* ... */ }
export async function postReview() { /* ... */ }
export async function deleteReview() { /* ... */ }
