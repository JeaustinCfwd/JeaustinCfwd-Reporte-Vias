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
        credentials: 'include',
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
        credentials: 'include',
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
            credentials: 'include',
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
            credentials: 'include',
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

// ❌ ESTA ERA LA FUNCIÓN ANTERIOR — YA NO EXISTE
// export async function deleteReview(reviewId) { ... }

// ✅ ESTA ES LA NUEVA FUNCIÓN (como pediste EXACTAMENTE)
export async function deleteReview(comentarioId) {
    try {
        const usuarioId = localStorage.getItem('id_usuario');
        
        if (!usuarioId) {
            throw new Error('Debes estar autenticado para eliminar comentarios');
        }

        const res = await fetch(`http://127.0.0.1:8000/api/eliminar-comentario/${comentarioId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario_id: usuarioId
            }),
            credentials: 'include',
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Error eliminando comentario: ${res.status}`);
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error('Error eliminando comentario:', error);
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
            credentials: 'include',
        });

        if (!res.ok) {
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
            credentials: 'include',
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
    try {
        const res = await fetch(`${API_URL}usuarios/${userId}/foto/`, {
            credentials: 'include',
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
            credentials: 'include',
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

export async function postData(obj, endpoint) {
    try {
        const peticion = await fetch(`http://127.0.0.1:8000/api/${endpoint}/`, {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        });

        const data = await peticion.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error(error);
    }
}

export async function getComentarios() {
    try {
        const res = await fetch(API_URL + 'crear-comentario/', {
            method: 'GET',
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error(`Error obteniendo comentarios: ${res.status}`);
        }

        const comentarios = await res.json();
        return comentarios;

    } catch (error) {
        console.error('Error obteniendo comentarios:', error);
        throw error;
    }
}
