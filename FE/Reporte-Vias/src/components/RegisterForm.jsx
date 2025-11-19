import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/fetch.js';
import { useToast } from '../contexts/ToastContext';
import "../styles/Forms.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  
  // *** CAMBIO 1: Renombrar campos para que coincidan con Django ***
  const [formData, setFormData] = useState({
    username: '', 
    first_name: '', 
    last_name: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });
  const [mostrarClave, setMostrarClave] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setMostrarClave(!mostrarClave);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmarPassword) {
      showError("Las contraseñas no coinciden");
      return;
    }
    
    // *** CAMBIO 2: Construir el objeto de datos que espera Django ***
    const userData = {
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      rol: 'usuario',
    };
    
    try {
      const responseData = await registerUser(userData); 
      
      if (responseData) {
        success(`¡Cuenta creada exitosamente! Bienvenido ${responseData.username}`);
        navigate('/login');
      } else {
        showError('Error al registrar usuario');
      }
    } catch (error) {
      showError('Error al registrar: ' + error.message);
    }

  };
  
  const handleNavigateToLogin = () => {
    navigate('/login');
  };
  

  return (
    <div className="fondo-registro">
      <div className="contenedor-login">
        <div className="formulario-usuario">
          <h1 className="titulo-login">Crear cuenta</h1>

          <form onSubmit={handleSubmit}>
            {/* Input Username */}
            <div className="grupo-entrada">
              <label htmlFor="username" className="etiqueta-entrada">Nombre de Usuario</label>
              <div className="campo-entrada">
                <User className="icono-entrada" size={20} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Ingresa tu nombre de usuario"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                  required
                />
              </div>
            </div>

            {/* Input First Name */}
            <div className="grupo-entrada">
              <label htmlFor="first_name" className="etiqueta-entrada">Nombre</label>
              <div className="campo-entrada">
                <User className="icono-entrada" size={20} />
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder="Ingresa tu nombre"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                  required
                />
              </div>
            </div>
            
            {/* Input Last Name */}
            <div className="grupo-entrada">
              <label htmlFor="last_name" className="etiqueta-entrada">Apellido</label>
              <div className="campo-entrada">
                <User className="icono-entrada" size={20} />
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  placeholder="Ingresa tu apellido"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                  required
                />
              </div>
            </div>
            
            
            <div className="grupo-entrada">
              <label htmlFor="email" className="etiqueta-entrada">Correo electrónico</label>
              <div className="campo-entrada">
                <Mail className="icono-entrada" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Ingresa tu correo"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                  required
                />
              </div>
            </div>

            <div className="grupo-entrada">
              <label htmlFor="password" className="etiqueta-entrada">Contraseña</label>
              <div className="campo-entrada">
                <Lock className="icono-entrada" size={20} />
                <input
                  type={mostrarClave ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Crea una contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="toggle-clave"
                >
                  {mostrarClave ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="grupo-entrada">
              <label htmlFor="confirmarPassword" className="etiqueta-entrada">Confirmar contraseña</label>
              <div className="campo-entrada">
                <Lock className="icono-entrada" size={20} />
                <input
                  type={mostrarClave ? 'text' : 'password'}
                  id="confirmarPassword"
                  name="confirmarPassword"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmarPassword}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                  required
                />
              </div>
            </div>

            <button type="submit" className="boton-login">
              Registrarse
            </button>
          </form>

          <div className="separador"></div>

          <div className="navegacion-inferior">
            <span className="texto-inferior">¿Ya tienes cuenta?</span>
            <button 
              type="button" 
              onClick={handleNavigateToLogin}
              className="enlace-registro"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
