import { useContext, useEffect, useMemo, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  FaArrowLeft,
  FaBars,
  FaBoxOpen,
  FaCapsules,
  FaHeadset,
  FaHome,
  FaPalette,
  FaShoppingCart,
  FaSignOutAlt,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

import ThemeContext from "../context/ThemeContext";
import { getUser, logout } from "../utils/auth";

import "./CustomerLayout.css";

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const user = getUser() || {};
  const { activeTheme, cycleTheme } = useContext(ThemeContext);

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("pharma-cart")) || [];
    setCartCount(cart.length);
  }, [location.pathname]);

  const pageMeta = useMemo(() => {
    if (location.pathname.includes("/customer/medicines")) {
      return {
        title: "Medicine Store",
        description: "Explore curated medicines with a clean and easy browsing flow.",
      };
    }

    if (location.pathname.includes("/customer/cart")) {
      return {
        title: "Your Cart",
        description: "Review quantities, prices, and checkout details before placing the order.",
      };
    }

    if (location.pathname.includes("/customer/checkout")) {
      return {
        title: "Checkout",
        description: "Confirm your delivery details and choose the payment option that fits best.",
      };
    }

    if (location.pathname.includes("/customer/payment")) {
      return {
        title: "Secure Payment",
        description: "Finish your online order with a simple payment confirmation flow.",
      };
    }

    if (location.pathname.includes("/customer/orders")) {
      return {
        title: "My Orders",
        description: "Track previous purchases, payment status, and downloadable invoices.",
      };
    }

    if (location.pathname.includes("/customer/profile")) {
      return {
        title: "My Profile",
        description: "Keep your contact information and delivery preferences up to date.",
      };
    }

    if (location.pathname.includes("/customer/medicine")) {
      return {
        title: "Medicine Details",
        description: "Check stock, pricing, and purchase options before adding to cart.",
      };
    }

    return {
      title: "Welcome Back",
      description: "Manage your health essentials in a calmer, more organized storefront.",
    };
  }, [location.pathname]);

  const firstName = user.name?.split(" ")[0] || "Customer";
  const initials = (user.name || "Customer")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="workspace-shell customer-workspace">
      <button
        type="button"
        className="sidebar-toggle"
        aria-label="Toggle navigation"
        onClick={() => setOpen((currentValue) => !currentValue)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      <aside
        className={`workspace-sidebar customer-sidebar ${open ? "is-open" : ""}`}
      >
        <div className="customer-sidebar__top">
          <div className="customer-brand">
            <div className="customer-brand__icon">
              <FaCapsules />
            </div>

            <div>
              <h2>Pharma ERP</h2>
              <p>Your Health Partner</p>
            </div>
          </div>

          <div className="customer-profile-card">
            <div className="customer-avatar">{initials || "CU"}</div>
            <h3>{user.name || "Customer"}</h3>
            <p>{user.email || "customer@pharma.local"}</p>
            <div className="customer-profile-card__status">
              <span />
              Active account
            </div>
          </div>

          <div className="customer-quick-stats">
            <div className="customer-quick-card">
              <h3>{cartCount}</h3>
              <p>Items saved</p>
            </div>
            <div className="customer-quick-card">
              <h3>24/7</h3>
              <p>Care support</p>
            </div>
          </div>

          <nav className="customer-nav">
            <NavLink
              to="/customer/home"
              className={({ isActive }) =>
                isActive ? "customer-nav__link active" : "customer-nav__link"
              }
              onClick={() => setOpen(false)}
            >
              <FaHome />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/customer/medicines"
              className={({ isActive }) =>
                isActive ? "customer-nav__link active" : "customer-nav__link"
              }
              onClick={() => setOpen(false)}
            >
              <FaCapsules />
              <span>Medicines</span>
            </NavLink>

            <NavLink
              to="/customer/cart"
              className={({ isActive }) =>
                isActive ? "customer-nav__link active" : "customer-nav__link"
              }
              onClick={() => setOpen(false)}
            >
              <FaShoppingCart />
              <span>Cart</span>
              {cartCount > 0 && <span className="customer-nav__badge">{cartCount}</span>}
            </NavLink>

            <NavLink
              to="/customer/orders"
              className={({ isActive }) =>
                isActive ? "customer-nav__link active" : "customer-nav__link"
              }
              onClick={() => setOpen(false)}
            >
              <FaBoxOpen />
              <span>My Orders</span>
            </NavLink>

            <NavLink
              to="/customer/profile"
              className={({ isActive }) =>
                isActive ? "customer-nav__link active" : "customer-nav__link"
              }
              onClick={() => setOpen(false)}
            >
              <FaUserCircle />
              <span>Profile</span>
            </NavLink>
          </nav>
        </div>

        <div className="customer-sidebar__footer">
          <div className="customer-support-box">
            <FaHeadset />
            <h4>Need help?</h4>
            <p>support@pharma-erp.local</p>
            <small>Trusted assistance whenever you need it.</small>
          </div>

          <button type="button" className="customer-sidebar__button" onClick={cycleTheme}>
            <FaPalette />
            Theme: {activeTheme.shortLabel}
          </button>

          <button
            type="button"
            className="customer-sidebar__button customer-sidebar__button--ghost"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="workspace-main">
        <header className="workspace-header">
          <div className="workspace-heading">
            <span className="eyebrow">Customer workspace</span>
            <h1>{pageMeta.title}</h1>
            <p>{pageMeta.description}</p>
          </div>

          <div className="workspace-actions">
            <button type="button" className="action-chip" onClick={cycleTheme}>
              <FaPalette />
              {activeTheme.label}
            </button>

            <button
              type="button"
              className="action-chip"
              onClick={() => navigate("/customer/cart")}
            >
              <FaShoppingCart />
              Cart ({cartCount})
            </button>

            <button
              type="button"
              className="action-chip"
              onClick={() =>
                navigate(location.pathname === "/customer/home" ? "/login" : "/customer/home")
              }
            >
              <FaArrowLeft />
              {location.pathname === "/customer/home" ? "Exit" : "Home"}
            </button>

            <div className="user-pill">
              <div className="user-avatar">{initials || "CU"}</div>

              <div>
                <strong>Hi, {firstName}</strong>
                <span>Protected orders and verified stock</span>
              </div>
            </div>
          </div>
        </header>

        <div className="workspace-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
