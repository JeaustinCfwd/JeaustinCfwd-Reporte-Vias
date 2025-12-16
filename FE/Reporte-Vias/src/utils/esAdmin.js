// Utilidad para verificar si el usuario es administrador
export const esAdmin = (usuario) => {
  return usuario?.rol === 'admin';
};
