import React from 'react';

const RPDescripcion = ({ value, onChange }) => {
 return (
  <section className="form-section">
   <h2 className="section-title">Descripción del Problema</h2>
   <textarea
    name="description"
    value={value}
    onChange={onChange}
    placeholder="Describe el problema vial..."
    rows={4}
    className="textarea-input"
    required
   ></textarea>
  </section>
 );
};

export default RPDescripcion;
