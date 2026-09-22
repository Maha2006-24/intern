import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCapsules,
  FaEnvelope,
  FaLock,
  FaPalette,
  FaPhone,
  FaShieldAlt,
  FaTruck,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";

import { registerCustomer } from "../services/api";
import ThemeContext from "../context/ThemeContext";
import { saveAuthSession } from "../utils/auth";

import "./Login.css";

export default function Register() {
  const navigate = useNavigate();
  const { activeTheme, cycleTheme } = useContext(ThemeContext);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const session = await registerCustomer({
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
      });

      saveAuthSession(session);
      navigate("/customer/home");
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

          <h1>Create a customer account with a cleaner flow.</h1>

          <p>
            Register once, then browse medicines, track your orders,
            and manage delivery details from a polished customer dashboard.
          </p>

          <div className="feature">
            <FaCapsules />
            <div>
              <h3>Medicine Store</h3>
              <p>Explore verified products and check stock before buying.</p>
            </div>
          </div>

          <div className="feature">
            <FaTruck />
            <div>
              <h3>Fast Fulfillment</h3>
              <p>Order summaries, payment options, and delivery steps stay clear.</p>
            </div>
          </div>

          <div className="feature">
            <FaShieldAlt />
            <div>
              <h3>Secure Platform</h3>
              <p>Your account and order history remain protected locally.</p>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="lock">
            <FaUserPlus />
          </div>

          <h2>Register</h2>
          <p>Create your Pharma ERP account</p>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <FaUser />
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <FaPhone />
              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <FaEnvelope />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <FaLock />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <FaLock />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="register-text">
            Already have an account?
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
