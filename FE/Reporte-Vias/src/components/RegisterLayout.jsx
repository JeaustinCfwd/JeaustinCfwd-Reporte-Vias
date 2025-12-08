import React, { useEffect } from 'react';
import Plasma from '../components/Plasma';
import RegisterForm from '../components/RegisterForm';

const RegisterLayout = () => {
  useEffect(() => {
    document.body.classList.add('register-page-body');
    return () => {
      document.body.classList.remove('register-page-body');
    };
  }, []);

  return (
    <div className="register-layout-container">
      <Plasma
        color="#ffffff"   /* humo blanco */
        speed={0.4}
        direction="forward"
        scale={1.2}
        opacity={1}
        mouseInteractive={true}
      />
      <div className="register-layout-content">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterLayout;
