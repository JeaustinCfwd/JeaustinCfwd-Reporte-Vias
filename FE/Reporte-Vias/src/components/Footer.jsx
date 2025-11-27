import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Footer.css";
import SocialLinks from "./SocialLinks";
import { AuthContext } from "../App";

const Footer = () => {
  const { user } = useContext(AuthContext);

  return (
    <footer className="footer-container">
      {/* SECCIÓN PRINCIPAL */}
      <div className="footer-main">
        <div className="footer-grid">
          {/* Columna logo */}
          <div>
            <h2 className="footer-logo">Reporte Vías CR</h2>
            <p className="footer-slogan">Mejorando las carreteras de Costa Rica.</p>
          </div>

          {/* Columna 1 */}
          <div>
            <h3 className="footer-heading">Navegación</h3>
            <ul className="footer-links">
              <li><NavLink to="/">Inicio</NavLink></li>
              <li><NavLink to="/dashboard">Mapa</NavLink></li>
              <li><NavLink to="/dashboard">Reportes</NavLink></li>
            </ul>
          </div>

          {/* Columna 2 */}
          <div>
            <h3 className="footer-heading">Cuenta</h3>
            <ul className="footer-links">
              <li><NavLink to="/login">Iniciar Sesión</NavLink></li>
              <li><NavLink to="/register">Registrarse</NavLink></li>
              {user && <li><NavLink to="/profile">Perfil</NavLink></li>}
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h3 className="footer-heading">Soporte</h3>
            <ul className="footer-links">
              <li><NavLink to="/faq">Preguntas Frecuentes</NavLink></li>
              <li><NavLink to="/contacto">Contacto</NavLink></li>
              <li><NavLink to="/terminos">Términos y Condiciones</NavLink></li>
            </ul>
          </div>
        </div>
      </div>

      {/* DIVISOR */}
      <div className="footer-divider"></div>

      {/* PARTE DE ABAJO */}
      <div className="footer-bottom">
        <SocialLinks />
        <p className="footer-copyright">
          © {new Date().getFullYear()} Reporte Vías CR — Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
