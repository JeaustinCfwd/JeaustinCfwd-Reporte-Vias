const API_URL = 'http://localhost:8000/api/';

// Nueva función fetch con manejo de autenticación y refresco de token
export async function fetchWithAuth(URL, options = {}) {
    let token = getAccessToken();
    const newOptions = { ...options };

    if (!newOptions.headers) {
        newOptions.headers = {};
    }

    if (token) {
        newOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    if (!newOptions.headers['Content-Type']) {
        newOptions.headers['Content-Type'] = 'application/json';
    }

    newOptions.credentials = 'include';

    try {
        let res = await fetch(URL, newOptions);

        // Si el token expiró
        if (res.status === 401) {
            try {
                const newToken = await refreshAccessToken();
                newOptions.headers['Authorization'] = `Bearer ${newToken}`;
                res = await fetch(URL, newOptions);
            } catch (refreshError) {
                console.error("Fallo al refrescar el token:", refreshError);
                logout();
                window.location.href = '/login';
                throw new Error('La sesión ha expirado. Por favor, inicia sesión de nuevo.');
            }
        }

        if (!res.ok) {
            // Intentamos obtener el mensaje de error del backend
            let errorMessage = `Request failed with status ${res.status}`;
            try {
                const errorData = await res.json();
                errorMessage = errorData.detail || errorData.message || errorData.error || JSON.stringify(errorData);
            } catch (e) {
                // Si no es JSON, nos quedamos con el status
            }
            throw new Error(errorMessage);
        }

        return res;

    } catch (error) {
        // Solo re-lanzamos el error para que lo maneje el componente
        throw error;
    }
}

// 1. Función de Login con JWT
export async function loginUser(email, password) {
    const res = await fetch(API_URL + 'token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: email,
            password: password
        }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Error de inicio de sesión');
    }

    const data = await res.json();
    // Guardar tokens en localStorage
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
}

// Función para obtener el token de acceso
export function getAccessToken() {
    return localStorage.getItem('access_token');
}

// Función para refrescar el token
export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const res = await fetch(API_URL + 'token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refresh: refreshToken
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to refresh token');
    }

    const data = await res.json();
    localStorage.setItem('access_token', data.access);
    return data.access;
}

// Función para logout
export function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('user');
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

export async function deleteReview(comentarioId) {
    try {
        const usuarioId = localStorage.getItem('id_usuario');

        if (!usuarioId) {
            throw new Error('Debes estar autenticado para eliminar comentarios');
        }

        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/eliminar-comentario/${comentarioId}/`, {
            method: 'DELETE',
            body: JSON.stringify({
                usuario_id: usuarioId
            })
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
        const res = await fetchWithAuth(`${API_URL}usuario/${userId}/`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });

        if (!res.ok) {
            // Intentamos leer JSON una sola vez; si falla, lanzamos un error genérico
            try {
                const errorData = await res.json();
                throw new Error(errorData.mensaje || 'Error al actualizar usuario');
            } catch {
                throw new Error('Error al actualizar usuario');
            }
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
        const res = await fetchWithAuth(`${API_URL}usuarios/${userId}/`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error(`Error eliminando usuario: ${res.status}`);
        }

        // Si el backend devuelve 204 No Content, no hay body que parsear
        if (res.status === 204) {
            return null;
        }

        return res.json();

    } catch (error) {
        console.error('Error eliminando usuario:', error);
        throw error;
    }
}

export async function changePassword(newPassword) {
    try {
        const res = await fetchWithAuth(`${API_URL}cambiar-contrasena/`, {
            method: 'POST',
            body: JSON.stringify({
                new_password: newPassword,
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Error cambiando contraseña: ${res.status}`);
        }

        return res.json();
    } catch (error) {
        console.error('Error cambiando contraseña:', error);
        throw error;
    }
}

export async function getUserPhoto(userId) {
    try {
        const res = await fetchWithAuth(`${API_URL}usuarios/${userId}/foto/`);

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
        const res = await fetchWithAuth(API_URL + 'crear-reporte/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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
        const peticion = await fetchWithAuth(`http://127.0.0.1:8000/api/${endpoint}/`, {
            method: "POST",
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
        const res = await fetchWithAuth(API_URL + 'crear-comentario/');

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

export async function patchData(endpoint, obj) {
    const peticion = await fetchWithAuth(`http://localhost:8000/api/${endpoint}`, {
        method: "PATCH",
        body: JSON.stringify(obj)
    })
    const data = await peticion.json()
    console.log(data);
    return data
}
