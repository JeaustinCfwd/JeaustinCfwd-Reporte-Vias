import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/fetch'; // ← agregado exactamente como pediste

const PFCampo = ({ 
    label, 
    type = 'text', 
    name, 
    value, 
    onChange, 
    placeholder, 
    required = false,
    options = null,
    rows = null,
    displayValue = null,
    sideBySide = false
}) => {

    const [usuario, setUsuario] = useState([]);

    useEffect(() => {
        const traerUsuario = async () => {
            try {

                // ============================
                //    SE CAMBIÓ SOLO ESTA PARTE
                // ============================
                const peticion = await fetchWithAuth(
                    `http://localhost:8000/api/usuario/${localStorage.getItem('id_usuario')}`
                );
                // ============================

                if (!peticion.ok) {
                    const errorData = await peticion.json().catch(() => ({}));
                    console.error("Error en la petición de usuario:", errorData);
                    return;
                }

                const data = await peticion.json();

                if (data && data.id) {
                    setUsuario(data);
                } else {
                    console.error("No se encontraron datos de usuario en la respuesta:", data);
                }

            } catch (error) {
                console.error("Error al traer los datos del usuario:", error.message);
            }
        };

        traerUsuario();
    }, []);

    const renderInput = () => {
        if (type === 'textarea') {
            return (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={rows}
                    className="form-input"
                    placeholder={placeholder}
                    required={required}
                />
            );
        }

        if (type === 'select') {
            return (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="form-input"
                    required={required}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="form-input"
                placeholder={placeholder}
                required={required}
                minLength={type === 'password' ? 6 : undefined}
            />
        );
    };

    if (sideBySide && displayValue) {
        return (
            <div className="form-row-side-by-side">
                <div className="form-field form-field-display">
                    <label className="form-label">{label} Actual</label>
                    <div className="display-value">
                        {usuario[displayValue] ? usuario[displayValue] : 'Sin datos'}
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor={name} className="form-label">Nuevo {label}</label>
                    {renderInput()}
                </div>
            </div>
        );
    }

    return (
        <div className="form-row">
            <label htmlFor={name} className="form-label">{label}</label>
            <div className="form-field">
                {renderInput()}
            </div>
        </div>
    );
};

export default PFCampo;
