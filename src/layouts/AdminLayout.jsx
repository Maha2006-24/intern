import { useContext, useMemo, useState } from "react";
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
  FaChartLine,
  FaHome,
  FaPalette,
  FaSignOutAlt,
  FaTimes,
  FaTruck,
  FaUsers,
} from "react-icons/fa";

import ThemeContext from "../context/ThemeContext";
import { getUser, logout } from "../utils/auth";

import "./AdminLayout.css";

const adminNavItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaHome },
  { to: "/admin/medicines", label: "Medicines", icon: FaCapsules },
  { to: "/admin/suppliers", label: "Suppliers", icon: FaTruck },
  { to: "/admin/customers", label: "Customers", icon: FaUsers },
  { to: "/admin/orders", label: "Orders", icon: FaBoxOpen },
  { to: "/admin/reports", label: "Reports", icon: FaChartLine },
];

function buildPageMeta(pathname) {
  if (pathname.includes("/admin/medicines/add")) {
    return {
      title: "Add Medicine",
      description: "Create a new catalog item with pricing and stock details.",
    };
  }

  if (pathname.includes("/admin/medicines/edit")) {
    return {
      title: "Edit Medicine",
      description: "Update product pricing and stock without losing context.",
    };
  }

  if (pathname.includes("/admin/suppliers/add")) {
    return {
      title: "Add Supplier",
      description: "Keep your vendor network organized in one place.",
    };
  }

  if (pathname.includes("/admin/suppliers/edit")) {
    return {
      title: "Edit Supplier",
      description: "Refresh supplier contacts and delivery details quickly.",
    };
  }

  const pageMap = {
    "/admin/dashboard": {
      title: "Operations Dashboard",
      description: "Track medicines, customers, orders, and revenue from one workspace.",
    },
    "/admin/medicines": {
      title: "Medicine Inventory",
      description: "Review stock levels, pricing, and availability across the catalog.",
    },
    "/admin/suppliers": {
      title: "Supplier Network",
      description: "Manage external partners, contacts, and fulfillment support.",
    },
    "/admin/customers": {
      title: "Customer Directory",
      description: "Browse registered accounts and keep customer records tidy.",
    },
    "/admin/orders": {
      title: "Order Pipeline",
      description: "Monitor order progress, fulfillment, and delivery status.",
    },
    "/admin/reports": {
      title: "Business Reports",
      description: "See a fast overview of sales performance and system activity.",
    },
  };

  return (
    pageMap[pathname] || {
      title: "Admin Workspace",
      description: "Manage the pharmacy system with a clear and modern control center.",
    }
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { activeTheme, cycleTheme } = useContext(ThemeContext);
  const currentUser = getUser() || {};

  const pageMeta = useMemo(
    () => buildPageMeta(location.pathname),
    [location.pathname]
  );

  const initials = (currentUser.name || "Admin")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBack = () => {
    navigate(
      location.pathname === "/admin/dashboard"
        ? "/login"
        : "/admin/dashboard"
    );
  };

  return (
    <div className="workspace-shell admin-workspace">
      <button
        className="sidebar-toggle"
        type="button"
        aria-label="Toggle navigation"
        onClick={() => setSidebarOpen((currentValue) => !currentValue)}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside
        className={`workspace-sidebar admin-sidebar ${
          sidebarOpen ? "is-open" : ""
        }`}
      >
        <div className="admin-sidebar__top">
          <div className="admin-brand">
            <div className="admin-brand__icon">
              <FaCapsules />
            </div>

            <div>
              <h2>Pharma ERP</h2>
              <p>Admin control suite</p>
            </div>
          </div>

          <div className="admin-sidebar__summary">
            <span className="soft-pill">Central operations</span>
            <h3>Keep stock, suppliers, and customer orders aligned.</h3>
          </div>
        </div>

        <nav className="admin-nav">
          {adminNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `admin-nav__link ${isActive ? "active" : ""}`
                }
              >
                <Icon />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <button
            type="button"
            className="admin-sidebar__button"
            onClick={cycleTheme}
          >
            <FaPalette />
            Theme: {activeTheme.shortLabel}
          </button>

          <button
            type="button"
            className="admin-sidebar__button admin-sidebar__button--ghost"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <main className="workspace-main">
        <header className="workspace-header">
          <div className="workspace-heading">
            <span className="eyebrow">Admin workspace</span>
            <h1>{pageMeta.title}</h1>
            <p>{pageMeta.description}</p>
          </div>

          <div className="workspace-actions">
            <button type="button" className="action-chip" onClick={cycleTheme}>
              <FaPalette />
              {activeTheme.label}
            </button>

            <button type="button" className="action-chip" onClick={handleBack}>
              <FaArrowLeft />
              {location.pathname === "/admin/dashboard" ? "Exit" : "Dashboard"}
            </button>

            <div className="user-pill">
              <div className="user-avatar">{initials || "A"}</div>

              <div>
                <strong>{currentUser.name || "Administrator"}</strong>
                <span>{currentUser.email || "ops@pharma-erp.local"}</span>
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
