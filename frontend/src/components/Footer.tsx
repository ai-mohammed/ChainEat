import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
import "../App.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top section: three columns */}
        <div className="footer-top">
          {/* About/Logo */}
          <div className="footer-column footer-about">
            <h2>ChainEats</h2>
            <p>Your one-stop app for restaurant reservations.</p>
          </div>
          {/* Quick Links */}
          <div className="footer-column footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/restaurants">Restaurants</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
          {/* Social Media */}
          <div className="footer-column footer-social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>
        {/* Bottom section: Copyright */}
        <div className="footer-bottom">
          <p>© 2025 ChainEats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
