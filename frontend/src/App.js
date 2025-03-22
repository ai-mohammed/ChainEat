import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import AboutUs from "./AboutUs";


const API_BASE = "http://localhost:5000";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const logout = async () => {
    await axios.get(`${API_BASE}/auth/logout`, { withCredentials: true });
    setUser(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <div className="main-content">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-left">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/restaurants" className="nav-link">Restaurants</Link>
            <Link to="/about-us" className="nav-link">About Us</Link>
          </div>
          <div className="nav-right">
            {user ? (
              <>
                <Link to="/reservations" className="nav-link">My Reservations</Link>
                <button onClick={logout} className="logout-button">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link register-button">Register</Link>
              </>
            )}
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/reservations" element={user ? <Reservations user={user} /> : <Navigate to="/login" />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

/* Home Page - Hero Section */
const Home = () => (
  <div className="hero-section">
    <div className="hero-content">
      <h1>Welcome to <span className="highlight">ChainEats</span></h1>
      <p>Discover and book the best restaurants around!</p>
      <button className="cta-button">See Menu & Order</button>
    </div>
  </div>
);


/* Footer Component */
const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <h2>ChainEats</h2>
      <p>Discover and book the best restaurants in your city with ease.</p>
      <div className="footer-links">
        <Link to="/">Home</Link> | <Link to="/about-us">About Us</Link> | <Link to="/restaurants">Restaurants</Link>
      </div>
    </div>
  </footer>
);

/* Login Component */
const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data);
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
};

/* Register Component */
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/auth/register`, { email, password });
      alert("Registered successfully");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
    </form>
  );
};

/* Restaurants Component */
const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/restaurants`)
      .then((response) => setRestaurants(response.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="restaurants-container">
      <h2>Restaurants</h2>
      <ul>
        {restaurants.map((r) => (
          <li key={r._id} className="restaurant-item">
            {r.name} - {r.cuisine}
            <button className="book-btn">Book Now</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* Reservations Component */
const Reservations = ({ user }) => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/reservations/my`, { withCredentials: true })
      .then((response) => setReservations(response.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="reservations-container">
      <h2>My Reservations</h2>
      <ul>
        {reservations.map((r) => (
          <li key={r._id}>
            {r.restaurant.name} - {new Date(r.reservationDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;


