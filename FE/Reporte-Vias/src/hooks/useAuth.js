import { useContext } from 'react';
import { AuthContext } from '../App';

// Hook para manejar autenticación y permisos
export const useAuth = () => {
  const { user } = useContext(AuthContext);
  
  // Fallback a localStorage si el contexto no tiene rol
  const localStorageUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userWithRol = user?.rol ? user : localStorageUser;
  
  // Si el usuario no tiene rol pero es 'Jeaustin', asignar rol 'admin'
  if (!userWithRol.rol && userWithRol.username === 'Jeaustin') {
    userWithRol.rol = 'admin';
    // Actualizar localStorage
    localStorage.setItem('user', JSON.stringify(userWithRol));
  }
  
  return {
    usuario: userWithRol,
    esAdmin: userWithRol?.rol === 'admin',
    esUsuario: userWithRol?.rol === 'usuario',
    estaAutenticado: !!userWithRol
  };
};
