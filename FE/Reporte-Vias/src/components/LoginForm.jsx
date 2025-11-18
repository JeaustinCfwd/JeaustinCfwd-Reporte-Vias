import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import "../styles/Forms.css";
import { loginUser } from '../services/fetch';
import { useNavigate } from 'react-router-dom';
// ==================== COMPONENTE SIN LÓGICA ====================
const LoginForm = () => {
 const [username, setUsername] = useState("")
 const [password, setPassword] = useState("")
 const navigate = useNavigate()

 async function validarInicio() {
  const objUsuario = {
   username: username,
   password: password
  }
  const peticion = await loginUser(objUsuario.username, objUsuario.password)
  if (peticion.mensaje === "Inicio exitoso") {
   navigate("/dashboard")
  }
  console.log(peticion);

 }

 return (
  <div className="fondo-login">
   <div className="contenedor-login">
    <div className="formulario-usuario">
     {/* Header */}
     <h1 className="titulo-login">Iniciar sesión</h1>

     {/* ==================== FORMULARIO SOLO ESTÉTICO ==================== */}
     <form>
      {/* Campo de Usuario */}
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
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         type="password"
         id="password"
         name="password"
         placeholder="Ingresa tu contraseña"
         className="elemento-entrada"
         autoComplete="current-password"
        />
        <button
         type="button"
         className="toggle-clave"
        >
         <Eye size={20} />
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
         className="input-checkbox"
        />
        <label htmlFor="recordar" className="etiqueta-checkbox">
         Recordarme
        </label>
       </div>
      </div>

      {/* Botón */}
      <button
       type="button"
       className="boton-login"
       onClick={validarInicio}
      >
       Iniciar sesión
      </button>
     </form>

     {/* Separador */}
     <div className="separador"></div>

     {/* ==================== NAVEGACIÓN INFERIOR ==================== */}
     <div className="navegacion-inferior">
      <span className="texto-inferior">¿No tienes una cuenta?</span>
      <button
       type="button"
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
