import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaCapsules,
  FaEnvelope,
  FaLock,
  FaPalette,
  FaShieldAlt,
  FaTruck,
  FaUsers,
} from "react-icons/fa";

import { loginUser } from "../services/api";
import ThemeContext from "../context/ThemeContext";
import { saveAuthSession } from "../utils/auth";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { activeTheme, cycleTheme } = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const session = await loginUser({ email, password });
      saveAuthSession(session);

      if (session.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/home");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="left-panel">
          <div className="login-theme-row">
            <button
              type="button"
              className="auth-theme-button"
              onClick={cycleTheme}
            >
              <FaPalette />
              {activeTheme.label}
            </button>
          </div>

          <div className="login-logo">
            <FaCapsules />
            <span>Pharma ERP</span>
          </div>

          <h1>Modern pharmacy management, all in one place.</h1>

          <p>
            Sign in to manage medicine stock, supplier workflows,
            customer orders, and reporting with a cleaner,
            more organized workspace.
          </p>

          <div className="feature">
            <FaShieldAlt />
            <div>
              <h3>Secure Login</h3>
              <p>Protected access for both admin and customer sessions.</p>
            </div>
          </div>

          <div className="feature">
            <FaCapsules />
            <div>
              <h3>Medicine Management</h3>
              <p>Track pricing, stock, and availability without clutter.</p>
            </div>
          </div>

          <div className="feature">
            <FaBoxOpen />
            <div>
              <h3>Order Tracking</h3>
              <p>Follow payment, fulfillment, and delivery in one flow.</p>
            </div>
          </div>

          <div className="feature">
            <FaUsers />
            <div>
              <h3>Customer Dashboard</h3>
              <p>Keep profiles, history, and support details easy to find.</p>
            </div>
          </div>

          <div className="feature">
            <FaTruck />
            <div>
              <h3>Supplier Coordination</h3>
              <p>Review vendor details and stock movement in seconds.</p>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="lock">
            <FaLock />
          </div>

          <h2>Login</h2>
          <p>Enter your credentials to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <FaEnvelope />
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="input-box">
              <FaLock />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          <div className="register-text">
            Don&apos;t have an account?
            <Link to="/register">Register here</Link>
          </div>

          <div className="security-card">
            <FaShieldAlt />
            <div>
              <h4>Your security is our priority</h4>
              <p>Theme preferences and account access stay synced locally.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
