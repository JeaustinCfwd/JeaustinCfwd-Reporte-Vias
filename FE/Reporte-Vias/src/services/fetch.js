const API_URL = 'http://localhost:8000/api/';

// 1. Función de Login
export async function loginUser(email, password) {
    const res = await fetch(API_URL + 'login/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
            username: email,
            password: password 
        }),
        credentials: 'include', // ✅ Usar sesiones
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.mensaje || 'Error de inicio de sesión');
    }
    
    const data = await res.json();
    return data;
}

// 2. Función de Registro de Usuario
export async function registerUser(userData) {
    const res = await fetch(API_URL + 'crear-user/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(userData),
        credentials: 'include', // ✅ Usar sesiones
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        console.error("Error en registerUser:", errorData);
        throw new Error(errorData.error || 'Error desconocido al registrar');
    }

    const data = await res.json();
    return data;
}

// 3. Funciones de reseñas (reviews)
export async function getReviews() {
    try {
        const res = await fetch(API_URL + 'reviews/', {
            method: 'GET',
            credentials: 'include', // ✅ Usar sesiones
        });

        if (!res.ok) {
            throw new Error(`Error obteniendo reseñas: ${res.status}`);
        }

        const reviews = await res.json();
        return reviews;

    } catch (error) {
        console.error('Error obteniendo reseñas:', error);
        throw error;
    }
}

export async function postReview(reviewData) {
    try {
        const res = await fetch(API_URL + 'reviews/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
            credentials: 'include', // ✅ Usar sesiones
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.mensaje || 'Error al enviar reseña');
        }

        const review = await res.json();
        return review;

    } catch (error) {
        console.error('Error enviando reseña:', error);
        throw error;
    }
}

export async function deleteReview(reviewId) {
    try {
        const res = await fetch(`${API_URL}reviews/${reviewId}/`, {
            method: 'DELETE',
            credentials: 'include', // ✅ Usar sesiones
        });

        if (!res.ok) {
            throw new Error(`Error eliminando reseña: ${res.status}`);
        }

        return res.json();

    } catch (error) {
        console.error('Error eliminando reseña:', error);
        throw error;
    }
}

// 4. Funciones de usuarios
export async function updateUser(userId, userData) {
    try {
        const res = await fetch(`${API_URL}usuario/${userId}/`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            credentials: 'include', // ✅ Usar sesiones
        });

        if (!res.ok) {
            // Si la respuesta no es JSON, esto lanzará el error que ves
            let errorData;
            try {
                errorData = await res.json();
            } catch {
                const errorText = await res.text();
                throw new Error(errorText || 'Error al actualizar usuario');
            }
            throw new Error(errorData.mensaje || 'Error al actualizar usuario');
        }

        const updatedUser = await res.json();
        return updatedUser;

    } catch (error) {
        console.error('Error actualizando usuario:', error);
        throw error;
    }
}

export async function deleteUser(userId) {
    try {
        const res = await fetch(`${API_URL}usuarios/${userId}/`, {
            method: 'DELETE',
            credentials: 'include', // ✅ Usar sesiones
        });

        if (!res.ok) {
            throw new Error(`Error eliminando usuario: ${res.status}`);
        }

        return res.json();

    } catch (error) {
        console.error('Error eliminando usuario:', error);
        throw error;
    }
}

export async function getUserPhoto(userId) {
    // Esta función obtiene la foto de usuario desde el backend
    // Si estás guardando la foto en localStorage, puedes retornarla desde allí
    // Si la obtienes del backend, haz una solicitud GET
    try {
        const res = await fetch(`${API_URL}usuarios/${userId}/foto/`, {
            credentials: 'include', // ✅ Usar sesiones
        });

        if (!res.ok) {
            throw new Error(`Error obteniendo foto: ${res.status}`);
        }

        const data = await res.json();
        return data.foto || null;

    } catch (error) {
        console.error('Error obteniendo foto de usuario:', error);
        return null;
    }
}

// 5. Otras funciones
export async function obtenerDatosEstadisticos() {
    try {
        const res = await fetch(API_URL + 'crear-reporte/', {
            method: 'GET',
            credentials: 'include', // ✅ Usar sesiones
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
        throw error;
    }
}