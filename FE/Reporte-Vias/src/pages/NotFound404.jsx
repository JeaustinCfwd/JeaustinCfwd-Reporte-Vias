import React from 'react';
import { useNavigate } from 'react-router-dom';
import Yeti404 from '../components/Yeti404';

const NotFound404 = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <Yeti404 />
      <div className="not-found-actions">
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Volver al Dashboard
        </button>
        <button onClick={() => navigate('/home')} className="btn-secondary">
          Ir a Inicio
        </button>
      </div>
    </div>
  );
};

export default NotFound404;
