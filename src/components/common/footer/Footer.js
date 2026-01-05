import React from 'react';
import Logo from "../../../assets/images/LOGO.svg";
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="sticky-footer">
      <section className="footer-top">
        <div className="container-fluid">
          <div className="footer-top-menus">
            <div className="footer-logo">
              <Link to="/">
                <img src={Logo} alt="Logo" className="main-logo" />
              </Link>
            </div>

            <div className="menu-links">
              <ul>
                <li><Link className="footer-link" to="/about">About Us</Link></li>
                <li><Link className="footer-link" to="/pricing">Pricing</Link></li>
                {/* <li><Link className="footer-link" to="#">Services</Link></li> */}
                <li><Link className="footer-link" to="/faq">FAQ’s</Link></li>
              </ul>
            </div>
          </div>

          <div className="copyright-text">
            <p>
              PolycraftsStudio® | Copyright 2026 |{" "}
              <Link to="/terms-conditions">Terms of service</Link> |{" "}
              <Link to="/privacy-policy">Privacy policy</Link>
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
