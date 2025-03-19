import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import "./App.css";

// Base URL for backend API
const API_BASE = "https://chaineat-9acv.onrender.com";

function App() {
  const [user, setUser] = useState(null); // State to track logged-in user
  const [loading, setLoading] = useState(true); // Prevent UI flickering before fetching user data

  // Fetch current user data from backend (session-based authentication)
  useEffect(() => {
    axios
      .get(`${API_BASE}/auth/users`, { withCredentials: true })
      .then((response) => {
        if (response.data) {
          setUser(response.data);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  // Logout function
  const logout = async () => {
    await axios.get(`${API_BASE}/auth/logout`, { withCredentials: true });
    setUser(null);
  };

  // Display "Loading..." while fetching user session data
  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/restaurants" className="nav-link">
            Restaurants
          </Link>
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <Link to="/reservations" className="nav-link">
                My Reservations
              </Link>
              <button onClick={logout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link register-button">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Routes for different pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route
          path="/reservations"
          element={
            user ? <Reservations user={user} /> : <Navigate to="/login" />
          }
        />
      </Routes>

      {/* Footer */}
      <Footer />
    </Router>
  );
}

/* Home Page Component */
const Home = () => (
  <div className="home-container">
    <h1>
      Welcome to <span className="highlight">Chaineats</span>
    </h1>
    <p>Discover and book the best restaurants around!</p>
  </div>
);

/* Footer Component */
const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-left">
        <h2>🍽️ <span className="bold">ChainEats</span></h2>
        <p>Discover and book the best restaurants in your city with ease.</p>
        <div className="social-icons">
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
      <div className="footer-right">
        <h3>About Us</h3>
        <p>ChainEats connects food lovers with top restaurants, offering seamless reservations and an enhanced dining experience.</p>
      </div>
    </div>
  </footer>
);

export default App;
