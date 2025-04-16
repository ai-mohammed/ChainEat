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

/* Login Component */
const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle login request
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
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

/* Register Component */
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle registration request
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
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};


/* Restaurants List Component */
const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  // Fetch restaurants from backend API
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
          <li key={r._id}>
            {r.name} - {r.cuisine}
          </li>
        ))}
      </ul>
    </div>
  );
};

/* Reservations List Component */
const Reservations = ({ user }) => {
  const [reservations, setReservations] = useState([]);

  // Fetch user's reservations from backend API
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
            {r.restaurant.name} -{" "}
            {new Date(r.reservationDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
