import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

const API_BASE = "http://localhost:5000";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/auth/users`, { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await axios.get(`${API_BASE}/auth/logout`, { withCredentials: true });
    setUser(null);
  };

  return (
    <Router>
      <nav>
        <div>
          <Link to="/">Home</Link>
          <Link to="/restaurants">Restaurants</Link>
        </div>
        <div>
          {user ? (
            <>
              <Link to="/reservations">My Reservations</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/reservations" element={user ? <Reservations user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

const Home = () => <h1>Welcome to Chaineats</h1>;

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password }, { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
};

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
    <form onSubmit={handleRegister}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
    </form>
  );
};

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/restaurants`)
      .then(response => setRestaurants(response.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="restaurants-container">
      <h2>Restaurants</h2>
      <ul>
        {restaurants.map(r => <li key={r._id}>{r.name} - {r.cuisine}</li>)}
      </ul>
    </div>
  );
};

const Reservations = ({ user }) => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/reservations/my`, { withCredentials: true })
      .then(response => setReservations(response.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="restaurants-container">
      <h2>My Reservations</h2>
      <ul>
        {reservations.map(r => (
          <li key={r._id}>{r.restaurant.name} - {new Date(r.reservationDate).toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
