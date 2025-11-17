import React, { useEffect } from 'react';
import Plasma from '../components/Plasma';
import RegisterForm from '../components/RegisterForm';

const RegisterLayout = () => {
  useEffect(() => {
    const prevBg = document.body.style.backgroundColor;
    const prevColor = document.body.style.color;
    document.body.style.backgroundColor = '#000'; // fondo global negro
    document.body.style.color = '#fff'; // texto por defecto blanco
    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.color = prevColor;
    };
  }, []);

  return (
    <div style={{
      position: 'relative',
      minHeight: 'calc(100vh - 60px)',
      width: '100%',
      overflow: 'hidden',
      isolation: 'isolate',
      backgroundColor: '#000'
    }}>
      <Plasma
        color="#ffffff"   /* humo blanco */
        speed={0.4}
        direction="forward"
        scale={1.2}
        opacity={1}
        mouseInteractive={true}
      />
      <div style={{ position: 'relative', zIndex: 1, minHeight: 'inherit', color: '#fff' }}>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterLayout;
