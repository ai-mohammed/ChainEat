import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginphoto from "../assets/login.jpg";

type Props = {
  setUser: (user: { email: string; role: string }) => void; // Added role
};

const Login = ({ setUser }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://chaineat-9acv.onrender.com/auth/login",
        { email, password },
        { withCredentials: true }
      );

      setUser({ email: (res.data as any).email, role: (res.data as any).role }); //added role explicitly
      navigate("/reservations");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{ display: "flex", background: "white", alignItems: "center" }}
    >
      <div className="login-image" style={{ flex: 1 }}>
        <img
          src={loginphoto}
          alt="Login"
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      </div>
      <div className="login-form" style={{ flex: 1, padding: "5%" }}>
        <form className="auth-form" onSubmit={handleLogin}>
          <h2 style={{ textAlign: "center" }}>Login</h2>
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
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="auth-text">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
