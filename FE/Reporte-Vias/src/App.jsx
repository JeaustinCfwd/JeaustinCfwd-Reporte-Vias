import React, { createContext, useState, useCallback } from 'react';
import Routing from './routes/Routing';
import { ToastProvider } from './components/ToastContext';
import ToastContainer from './components/ToastContainer';
import { useToast } from './components/ToastContext';

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

  const login = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    import('./services/fetch').then(({ logout: logoutService }) => {
      logoutService();
      setUser(null);
    });
  }, []);

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