import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import "../styles/Forms.css";
import { loginUser } from '../services/fetch';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
 const [username, setUsername] = useState("")
 const [password, setPassword] = useState("")
 const [showPassword, setShowPassword] = useState(false)
 const navigate = useNavigate()

 async function validarInicio() {
  const objUsuario = {
   username: username, password}
  const peticion = await loginUser(objUsuario.username, objUsuario.password)


  if (peticion.mensaje === "Inicio exitoso") {
     if(peticion.token) localStorage.setItem('token', peticion.token);
     if (peticion.user) localStorage.setItem('user', JSON.stringify(peticion.user));
    else localStorage.setItem('user', JSON.stringify({username}));
   navigate("/dashboard");
   }
  console.log(peticion);
 }

 function handleNavigateToRegister() {
    navigate('/register');
  }

 return (
  <div className="fondo-login">
   <div className="contenedor-login">
    <div className="formulario-usuario">
     <h1 className="titulo-login">Iniciar sesión</h1>

     <form>
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
        />
        <button
         type="button"
         className="toggle-clave"
         onClick={() => setShowPassword(!showPassword)}
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
      >
       Iniciar sesión
      </button>
     </form>

     <div className="separador"></div>

     <div className="navegacion-inferior">
      <span className="texto-inferior">¿No tienes una cuenta?</span>
      <button
       type="button"
       className="enlace-registro btn-reset"
       onClick={handleNavigateToRegister}
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