import { useEffect, useState } from "react";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Restaurants from "./pages/Restaurants";
import Reservations from "./components/Reservations";

type User = {
  email: string;
};

const API_BASE = "http://localhost:5000";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/auth/users`, { withCredentials: true })
      .then((res) => {
        setUser(res.data || null);
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
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route
              path="/reservations"
              element={user ? <Reservations /> : <Navigate to="/login" />}
            />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
