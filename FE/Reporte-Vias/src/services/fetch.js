export async function obtenerDatosEstadisticos() {
  // 1. Obtener el token de acceso de localStorage
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    console.error("Autenticación requerida. Token no encontrado.");
    return { totalReportes: 0, problemasResueltos: 0, usuariosActivos: 0, promedioDias: '0' };
  }
  
  try {
    // 2. Usar la nueva URL de Django y agregar el Header de Autorización
    const res = await fetch('http://localhost:8000/api/users/', { 
      // Si usas GET, puedes omitir 'method: "GET"', pero lo incluimos para los headers
      headers: {
        'Authorization': `Bearer ${token}` // <--- ¡Esto es lo nuevo!
      }
    });

    if (!res.ok) {
      // Si es 401 (Unauthorized), el token expiró o es inválido.
      if (res.status === 401) {
          console.error("Token expirado o inválido. Necesitas refrescar o reloguear.");
      }
      throw new Error(`Error obteniendo datos: ${res.status}`);
    }
    
    // ... el resto de tu lógica de cálculo de datos sigue igual
    const reportes = await res.json();
    
    // NOTA: Asumimos que Django devuelve los datos con los mismos nombres de campo (state, fechaResolucion, etc.)
    
    // ... el resto de la lógica de cálculo de estadísticas (totalReportes, problemasResueltos, etc.)
    
  } catch (error) {
    console.error('Error obteniendo datos estadísticos:', error);
    return { totalReportes: 0, problemasResueltos: 0, usuariosActivos: 0, promedioDias: '0' };
  }
}