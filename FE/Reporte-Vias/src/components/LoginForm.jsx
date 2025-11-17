import React, { useState, useCallback } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/fetch.js';
import { useToast } from '../contexts/ToastContext';
import "../styles/Forms.css";

const LoginForm = () => {
    const navigate = useNavigate();
    const { success, error: showError } = useToast();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        recordar: false
    });
    const [mostrarClave, setMostrarClave] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError(null);
    };

    const togglePasswordVisibility = useCallback(() => {
        setMostrarClave(prev => !prev);
    }, []);

const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    setLoading(true);
    try {
        // Debes modificar loginUser para que devuelva { user, token }
        const { user, token } = await loginUser(formData.email, formData.password);

        if (user && user.id && token) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            window.dispatchEvent(new Event('userChange'));
            success(`¡Bienvenido ${user.name}!`);
            navigate('/dashboard');
        } else {
            setError('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
            showError('Credenciales inválidas. Verifica tu correo y contraseña');
            setFormData(prev => ({ ...prev, password: '' })); 
        }
    } catch {
        setError('Error al iniciar sesión. Inténtalo de nuevo más tarde.'); 
        showError('Error al iniciar sesión. Inténtalo de nuevo más tarde');
        setFormData(prev => ({ ...prev, password: '' })); 
    } finally {
        setLoading(false);
    }
};

    const handleNavigateToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="fondo-login">
            <div className="contenedor-login">
                <div className="formulario-usuario">
                    <h1 className="titulo-login">Iniciar sesión</h1>
                    
                    {error && <div className="mensaje-error-form">{error}</div>}

                    <form onSubmit={handleSubmit}>
<div className="grupo-entrada">
    <label htmlFor="email" className="etiqueta-entrada">Usuario</label>
    <div className="campo-entrada">
        <Mail className="icono-entrada" size={20} />
        <input
            type="text" // <-- Puede ser "text" si no quieres validación de email
            id="email"
            name="email"
            placeholder="Ingresa tu usuario"
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
                                    placeholder="Ingresa tu contraseña"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="elemento-entrada"
                                    required
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

                        <button type="submit" className="boton-login" disabled={loading}>
                            {loading ? 'Cargando...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    <div className="separador"></div>

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