import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa"; // Import icons
import "./Footer.css"; // Import your CSS file for styling

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
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/restaurants">Restaurants</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
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
