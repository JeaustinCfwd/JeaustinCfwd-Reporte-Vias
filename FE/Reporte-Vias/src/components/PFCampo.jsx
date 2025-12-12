import React from 'react';

// Este componente ya no trae datos por su cuenta.
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
    displayValue = null, // Este valor ahora será el texto a mostrar directamente.
    sideBySide = false
}) => {

    const renderInput = () => {
        if (type === 'textarea') {
            return (
                <textarea
                    id={name}
                    name={name}
                    value={value || ''}
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
                    value={value || ''}
                    onChange={onChange}
                    className="form-input"
                    required={required}
                >
                    {options?.map(option => (
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
                value={value || ''}
                onChange={onChange}
                className="form-input"
                placeholder={placeholder}
                required={required}
                minLength={type === 'password' ? 6 : undefined}
            />
        );
    };

    if (sideBySide) {
        return (
            <div className="form-row-side-by-side">
                <div className="form-field form-field-display">
                    <label className="form-label">{label} Actual</label>

                    <div className="display-value">
                        {displayValue || 'Sin datos'}
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
