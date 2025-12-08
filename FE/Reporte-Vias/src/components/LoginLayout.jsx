import React, { useEffect } from 'react';
import Plasma from '../components/Plasma';
import LoginForm from '../components/LoginForm';

const LoginLayout = () => {
  useEffect(() => {
    document.body.classList.add('login-page-body');
    return () => {
      document.body.classList.remove('login-page-body');
    };
  }, []);

  return (
    <div className="login-layout-container">
      <Plasma 
        color="#ffffff"        // humo blanco
        speed={0.4}
        direction="forward"
        scale={1.2}
        opacity={1}
        mouseInteractive={true}
      />
      <div style={{ position: 'relative', zIndex: 1, minHeight: 'inherit', color: '#fff' }}>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginLayout;