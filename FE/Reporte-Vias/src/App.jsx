import React, { createContext, useState, useCallback } from 'react';
import Routing from './routes/Routing';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import { useToast } from './contexts/ToastContext';

export const AuthContext = createContext();

const AppContent = () => {
  const { toasts, removeToast } = useToast();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  // No necesitas token si usas sesiones
  const login = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // No necesitas isAuthenticated si solo usas user
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Routing />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AuthContext.Provider>
  );
};

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;