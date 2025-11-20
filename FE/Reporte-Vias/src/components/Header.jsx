import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Menu, X, MapPin, User, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import ShinyText from './ShinyText';
import { AuthContext } from '../App';

// ==================== CONSTANTES ====================
const enlaces = [
  { id: 'inicio', nombre: 'Inicio', ruta: '/' },
  { id: 'reportar', nombre: 'Reportar', ruta: '/reportCreate', icono: <MapPin size={16} />, protected: true },
  { id: 'mapa', nombre: 'Mapa', ruta: '/dashboard', protected: true },
  { id: 'dashboard', nombre: 'Dashboard', ruta: '/dashboard', protected: true },
];

// ==================== COMPONENTE PRINCIPAL ====================
const Header = () => {
  // ========== HOOKS ==========
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ========== ESTADO ==========
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  // ========== EFECTOS ==========
  useEffect(() => {
    const handleUserChange = () => {
      try {
        // Opcional: Actualizar estado local si cambia localStorage
        // Esto solo es necesario si AuthContext no se actualiza automáticamente
        // Si AuthContext ya maneja la persistencia, este useEffect puede no ser necesario
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    };

    window.addEventListener('storage', handleUserChange);

    return () => {
      window.removeEventListener('storage', handleUserChange);
    };
  }, []);

  // ========== FUNCIONES DE MANEJO ==========
  const handleLogout = useCallback(() => {
    logout();
    // Disparar un evento personalizado para notificar a otros componentes
    window.dispatchEvent(new Event('userChange'));
    setMenuMovilAbierto(false);
  }, [logout]);

  const handleProtectedClick = useCallback(() => {
    navigate('/login', { 
      state: { 
        from: window.location.pathname, 
        message: 'Debes iniciar sesión para acceder a esta función.' 
      } 
    });
    setMenuMovilAbierto(false);
  }, [navigate]);

  const toggleMenuMovil = useCallback(() => {
    setMenuMovilAbierto(prev => !prev);
  }, []);

  const closeMenuMovil = useCallback(() => {
    setMenuMovilAbierto(false);
  }, []);

  // ========== COMPONENTES AUXILIARES ==========
  const renderNavLink = (enlace) => {
    if (enlace.protected && !user) {
      return (
        <button
          onClick={handleProtectedClick}
          className="enlace-nav btn-reset"
        >
          {enlace.icono && <span className="icono-enlace">{enlace.icono}</span>}
          {enlace.nombre}
        </button>
      );
    }

    return (
      <NavLink
        to={enlace.ruta}
        className={({ isActive }) => `enlace-nav ${isActive ? 'activo' : ''}`}
      >
        {enlace.icono && <span className="icono-enlace">{enlace.icono}</span>}
        {enlace.nombre}
      </NavLink>
    );
  };

  const renderMobileNavLink = (enlace) => {
    if (enlace.protected && !user) {
      return (
        <button
          key={enlace.id}
          onClick={handleProtectedClick}
          className="enlace-movil btn-reset mobile-full-width"
        >
          {enlace.icono && <span className="icono-enlace">{enlace.icono}</span>}
          {enlace.nombre}
        </button>
      );
    }

    return (
      <NavLink
        key={enlace.id}
        to={enlace.ruta}
        className="enlace-movil"
        onClick={closeMenuMovil}
      >
        {enlace.icono && <span className="icono-enlace">{enlace.icono}</span>}
        {enlace.nombre}
      </NavLink>
    );
  };

  // ========== RENDER PRINCIPAL ==========
  return (
    <header className="encabezado-sitio">
      <div className="contenedor-navbar">
        {/* Logo */}
        <div className="logo-sitio">
          <NavLink to="/" className="logo-link"> 
            <h1 style={{ margin: 0 }}>
              <ShinyText text="ReporteVías CR" speed={3} />
            </h1>
          </NavLink>
        </div>

        {/* ==================== MENÚ ESCRITORIO ==================== */}
        <nav className="navegacion-desktop">
          <ul className="nav-lista">
            {/* Enlaces principales */}
            {enlaces.map(enlace => (
              <li key={enlace.id}>
                {renderNavLink(enlace)}
              </li>
            ))}

            {/* Enlaces de usuario */}
            {user ? (
              <>
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => `enlace-nav ${isActive ? 'activo' : ''}`}
                  >
                    <User size={16} className="inline mr-1" />
                    Perfil
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="enlace-nav btn-reset"
                  >
                    <LogOut size={16} className="inline mr-1" />
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `enlace-nav boton-login ${isActive ? 'activo' : ''}`}
                >
                  Iniciar Sesión
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Botón menú móvil */}
        <button 
          onClick={toggleMenuMovil} 
          className="boton-menu-movil" 
          aria-expanded={menuMovilAbierto} 
          aria-controls="menu-movil-container"
          aria-label={menuMovilAbierto ? "Cerrar menú" : "Abrir menú"}
        >
          {menuMovilAbierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ==================== MENÚ MÓVIL ==================== */}
      {menuMovilAbierto && (
        <div className="menu-movil" id="menu-movil-container">
          <nav className="navegacion-movil">
            {/* Enlaces principales */}
            {enlaces.map(enlace => renderMobileNavLink(enlace))}
            
            <hr className="separador-movil" />
            
            {/* Enlaces de usuario */}
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className="enlace-movil"
                  onClick={closeMenuMovil}
                >
                  <User size={16} className="inline mr-2" />
                  Perfil
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="enlace-movil boton-login-movil btn-reset mobile-full-width"
                >
                  <LogOut size={16} className="inline mr-2" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="enlace-movil boton-login-movil"
                onClick={closeMenuMovil}
              >
                Iniciar Sesión
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;