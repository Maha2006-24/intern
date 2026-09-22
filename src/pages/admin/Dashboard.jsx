import { useEffect, useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaCapsules,
  FaClock,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaUsers,
} from "react-icons/fa";

import { getCustomers, getMedicines, getOrders } from "../../services/api";

import "./Dashboard.css";

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    medicines: [],
    customers: [],
    orders: [],
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [medicines, customers, orders] = await Promise.all([
          getMedicines(),
          getCustomers(),
          getOrders(),
        ]);

        setStats({ medicines, customers, orders });
      } catch (error) {
        console.log(error);
      }
    }

    loadDashboard();
  }, []);

  const totals = useMemo(() => {
    const revenue = stats.orders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );
    const lowStock = stats.medicines.filter(
      (item) => Number(item.stock || 0) < 10
    ).length;
    const pendingOrders = stats.orders.filter((order) => {
      const status = (order.status || "").toLowerCase();
      return status === "pending" || status === "processing";
    }).length;

    return {
      revenue,
      lowStock,
      pendingOrders,
    };
  }, [stats]);

  return (
    <div className="dashboard page-shell">
      <section className="dashboard-hero panel">
        <div className="section-heading">
          <span className="eyebrow">Daily snapshot</span>
          <h1>Everything important is visible at a glance.</h1>
          <p>
            Keep the pharmacy organized with a cleaner overview of stock,
            customers, orders, and revenue.
          </p>
        </div>

        <div className="dashboard-hero__meta">
          <div className="dashboard-hero__pill">
            <FaClock />
            Refreshed when the page loads
          </div>
          <div className="dashboard-hero__pill dashboard-hero__pill--alert">
            <FaExclamationTriangle />
            {totals.lowStock} low stock items need review
          </div>
        </div>
      </section>

      <div className="metric-grid dashboard-grid">
        <article className="metric-card dashboard-card">
          <div className="metric-icon">
            <FaCapsules />
          </div>
          <div>
            <h2>{stats.medicines.length}</h2>
            <p>Medicines in catalog</p>
          </div>
        </article>

        <article className="metric-card dashboard-card">
          <div className="metric-icon">
            <FaUsers />
          </div>
          <div>
            <h2>{stats.customers.length}</h2>
            <p>Registered customers</p>
          </div>
        </article>

        <article className="metric-card dashboard-card">
          <div className="metric-icon">
            <FaBoxOpen />
          </div>
          <div>
            <h2>{stats.orders.length}</h2>
            <p>Total orders</p>
          </div>
        </article>

        <article className="metric-card dashboard-card">
          <div className="metric-icon">
            <FaMoneyBillWave />
          </div>
          <div>
            <h2>{formatCurrency(totals.revenue)}</h2>
            <p>Revenue processed</p>
          </div>
        </article>
      </div>

      <div className="dashboard-panels">
        <section className="panel dashboard-panel">
          <div className="section-heading">
            <h2>Operational highlights</h2>
            <p>Fast actions to help you decide where to focus next.</p>
          </div>

          <ul className="dashboard-activity-list">
            <li>
              <span>Orders awaiting completion</span>
              <strong>{totals.pendingOrders}</strong>
            </li>
            <li>
              <span>Medicines below stock threshold</span>
              <strong>{totals.lowStock}</strong>
            </li>
            <li>
              <span>Customers currently tracked</span>
              <strong>{stats.customers.length}</strong>
            </li>
            <li>
              <span>Total inventory records</span>
              <strong>{stats.medicines.length}</strong>
            </li>
          </ul>
        </section>

        <section className="panel dashboard-spotlight">
          <span className="eyebrow">Focus area</span>
          <h2>Inventory health</h2>
          <p>
            {totals.lowStock > 0
              ? "A few items are running low. Restocking them early will keep the storefront smooth for customers."
              : "Stock levels look healthy right now. You can focus on orders and reporting without surprises."}
          </p>
          <div className="dashboard-spotlight__status">
            <span className={`status-chip ${totals.lowStock > 0 ? "warning" : "success"}`}>
              {totals.lowStock > 0 ? "Needs attention" : "Healthy inventory"}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
