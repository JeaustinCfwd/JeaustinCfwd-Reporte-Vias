import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  return (user || token) ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;