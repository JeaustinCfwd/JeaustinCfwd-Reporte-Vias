import React, { useState, useContext } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import "../styles/Forms.css";
import { loginUser } from '../services/fetch';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  async function validarInicio() {
    if (!username || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const peticion = await loginUser(username, password);

      if (peticion.access && peticion.refresh) {
        // Login exitoso con JWT tokens
        login({ username });
        
        // ✅ Los tokens ya se guardan en la función loginUser como:
        // - access_token
        // - refresh_token
        
        // Obtener el ID del usuario desde el token decodificado
        try {
          const tokenPayload = JSON.parse(atob(peticion.access.split('.')[1]));
          localStorage.setItem("id_usuario", tokenPayload.user_id);
        } catch (error) {
          console.error('Error decoding token:', error);
          // Si no podemos decodificar el token, hacemos una petición para obtener el user ID
          const userResponse = await fetch('http://localhost:8000/api/usuarios/me/', {
            headers: {
              'Authorization': `Bearer ${peticion.access}`
            }
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            localStorage.setItem("id_usuario", userData.id);
          }
        }
        navigate("/home");
      } else {
        setError("Error en el inicio de sesión: No se recibieron tokens");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError(error.message || "Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      validarInicio();
    }
  }

  function handleNavigateToRegister() {
    navigate('/register');
  }

  return (
    <div className="fondo-login">
      <div className="contenedor-login">
        <div className="formulario-usuario">
          <h1 className="titulo-login">Iniciar sesión</h1>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onKeyPress={handleKeyPress}>
            <div className="grupo-entrada">
              <label htmlFor="email" className="etiqueta-entrada">
                Usuario
              </label>
              <div className="campo-entrada">
                <Mail className="icono-entrada" size={20} />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Ingresa tu usuario"
                  className="elemento-entrada"
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grupo-entrada">
              <label htmlFor="password" className="etiqueta-entrada">
                Contraseña
              </label>
              <div className="campo-entrada">
                <Lock className="icono-entrada" size={20} />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  className="elemento-entrada"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="toggle-clave"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="grupo-checkbox">
              <div className="envoltorio-checkbox">
                <input
                  type="checkbox"
                  id="recordar"
                  name="recordar"
                  className="input-checkbox"
                  disabled={isLoading}
                />
                <label htmlFor="recordar" className="etiqueta-checkbox">
                  Recordarme
                </label>
              </div>
            </div>

            <button
              type="button"
              className="boton-login"
              onClick={validarInicio}
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="separador"></div>

          <div className="navegacion-inferior">
            <span className="texto-inferior">¿No tienes una cuenta?</span>
            <button
              type="button"
              className="enlace-registro btn-reset"
              onClick={handleNavigateToRegister}
              disabled={isLoading}
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