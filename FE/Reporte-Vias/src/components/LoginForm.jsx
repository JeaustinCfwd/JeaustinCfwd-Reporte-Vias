import React, { useState, useCallback } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/fetch.js';
import { useToast } from '../contexts/ToastContext';
import "../styles/Forms.css";

// ==================== COMPONENTE PRINCIPAL ====================
const LoginForm = () => {
  // ========== HOOKS ==========
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  // ========== ESTADO ==========
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    recordar: false
  });
  const [mostrarClave, setMostrarClave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ========== FUNCIONES DE MANEJO ==========
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError(null);
  }, [error]);

  const togglePasswordVisibility = useCallback(() => {
    setMostrarClave(prev => !prev);
  }, []);

  const handleNavigateToRegister = useCallback(() => {
    navigate('/register');
  }, [navigate]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user, token } = await loginUser(formData.email, formData.password);

      if (user && user.id && token) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        window.dispatchEvent(new Event('userChange'));
        success(`¡Bienvenido ${user.name}!`);
        navigate('/dashboard');
      } else {
        const errorMsg = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
        setError(errorMsg);
        showError('Credenciales inválidas. Verifica tu correo y contraseña');
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (err) {
      const errorMsg = 'Error al iniciar sesión. Inténtalo de nuevo más tarde.';
      setError(errorMsg);
      showError(errorMsg);
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  }, [formData.email, formData.password, navigate, success, showError]);

  // ========== RENDER PRINCIPAL ==========
  return (
    <div className="fondo-login">
      <div className="contenedor-login">
        <div className="formulario-usuario">
          {/* Header */}
          <h1 className="titulo-login">Iniciar sesión</h1>
          
          {/* Mensaje de error */}
          {error && (
            <div className="mensaje-error-form" role="alert">
              {error}
            </div>
          )}

          {/* ==================== FORMULARIO ==================== */}
          <form onSubmit={handleSubmit}>
            {/* Campo de Usuario */}
            <div className="grupo-entrada">
              <label htmlFor="email" className="etiqueta-entrada">
                Usuario
              </label>
              <div className="campo-entrada">
                <Mail className="icono-entrada" size={20} />
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Ingresa tu usuario"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Campo de Contraseña */}
            <div className="grupo-entrada">
              <label htmlFor="password" className="etiqueta-entrada">
                Contraseña
              </label>
              <div className="campo-entrada">
                <Lock className="icono-entrada" size={20} />
                <input
                  type={mostrarClave ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="toggle-clave"
                  aria-label={mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {mostrarClave ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Checkbox Recordarme */}
            <div className="grupo-checkbox">
              <div className="envoltorio-checkbox">
                <input
                  type="checkbox"
                  id="recordar"
                  name="recordar"
                  checked={formData.recordar}
                  onChange={handleInputChange}
                  className="input-checkbox"
                />
                <label htmlFor="recordar" className="etiqueta-checkbox">
                  Recordarme
                </label>
              </div>
            </div>

            {/* Botón de Submit */}
            <button 
              type="submit" 
              className="boton-login" 
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Separador */}
          <div className="separador"></div>

          {/* ==================== NAVEGACIÓN INFERIOR ==================== */}
          <div className="navegacion-inferior">
            <span className="texto-inferior">¿No tienes una cuenta?</span>
            <button 
              type="button" 
              onClick={handleNavigateToRegister}
              className="enlace-registro btn-reset" 
            >
              Regístrate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;