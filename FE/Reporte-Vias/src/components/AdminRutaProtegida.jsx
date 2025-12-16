import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Componente para proteger rutas de administrador
export const RutaProtegida = ({ children }) => {
  const { esAdmin } = useAuth();
  
  if (!esAdmin) {
    return <Navigate to="/404" replace />;
  }
  
  return children;
};
