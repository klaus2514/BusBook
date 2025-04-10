import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="single-line-footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/">Home</Link>
          <span>•</span>
          <Link to="/book-ticket">Tickets</Link>
          <span>•</span>
          <Link to="/about">About</Link>
          <span>•</span>
          <Link to="/contact">Contact</Link>
          <span>•</span>
          <Link to="/faq">Help</Link>
          <span>•</span>
          <Link to="/terms">Terms</Link>
          <span>•</span>
          <Link to="/privacy">Privacy</Link>
        </div>
        
        <div className="footer-bottom">
          <div className="social-icons">
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
          <p className="copyright">© {new Date().getFullYear()} BusBooking</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;