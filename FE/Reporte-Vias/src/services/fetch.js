// Login: obtiene el token JWT y luego los datos del usuario
export async function loginUser(email, password) {
    // 1. Obtener el token - prueba con "username" en lugar de "email"
    const res = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }), // Cambiado a "username"
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    const token = data.access;

    // 2. Usar el token para obtener los datos del usuario
    const userRes = await fetch('http://localhost:8000/api/users/me/', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!userRes.ok) throw new Error('Failed to fetch user data');
    const user = await userRes.json();

    return { user, token };
}