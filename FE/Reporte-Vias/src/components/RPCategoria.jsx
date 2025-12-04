import React from 'react';
import { categories } from './RPConstantes';

const RPCategoria = ({ value, onChange }) => {
 return (
  <section className="form-section">
   <h2 className="section-title">Categoría</h2>
   <select
    name="category"
    value={value}
    onChange={onChange}
    className="select-input"
    required
   >
    <option value="" disabled>
     Selecciona una categoría
    </option>
    {categories.map((cat) => (
     <option key={cat.value} value={cat.value}>
      {cat.label}
     </option>
    ))}
   </select>
  </section>
 );
};

export default RPCategoria;
