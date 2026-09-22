import { useEffect, useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaCapsules,
  FaMoneyBillWave,
  FaTruck,
  FaUsers,
} from "react-icons/fa";

import {
  getCustomers,
  getMedicines,
  getOrders,
  getSuppliers,
} from "../../services/api";

import "./Reports.css";

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function Reports() {
  const [report, setReport] = useState({
    medicines: 0,
    suppliers: 0,
    customers: 0,
    orders: 0,
    revenue: 0,
  });

  useEffect(() => {
    async function loadReport() {
      try {
        const [medicines, suppliers, customers, orders] = await Promise.all([
          getMedicines(),
          getSuppliers(),
          getCustomers(),
          getOrders(),
        ]);

        const revenue = orders.reduce(
          (sum, order) => sum + Number(order.total || 0),
          0
        );

        setReport({
          medicines: medicines.length,
          suppliers: suppliers.length,
          customers: customers.length,
          orders: orders.length,
          revenue,
        });
      } catch (error) {
        console.log(error);
      }
    }

    loadReport();
  }, []);

  const cards = useMemo(
    () => [
      { label: "Medicines", value: report.medicines, icon: FaCapsules },
      { label: "Suppliers", value: report.suppliers, icon: FaTruck },
      { label: "Customers", value: report.customers, icon: FaUsers },
      { label: "Orders", value: report.orders, icon: FaBoxOpen },
      {
        label: "Revenue",
        value: formatCurrency(report.revenue),
        icon: FaMoneyBillWave,
        featured: true,
      },
    ],
    [report]
  );

  return (
    <div className="reports-page page-shell">
      <section className="panel reports-hero">
        <div className="page-title">
          <span className="eyebrow">Business pulse</span>
          <h1>Reports dashboard</h1>
          <p>Use a clean summary of inventory, customers, suppliers, and sales performance.</p>
        </div>
      </section>

      <div className="report-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className={`report-card ${card.featured ? "report-card--featured" : ""}`}
            >
              <div className="report-card__icon">
                <Icon />
              </div>
              <h2>{card.label}</h2>
              <h3>{card.value}</h3>
            </article>
          );
        })}
      </div>

      <section className="panel reports-summary">
        <h2>System summary</h2>
        <p>
          This dashboard provides a quick operational overview so the team can make
          smarter inventory, supplier, and customer decisions without digging through tables.
        </p>
      </section>
    </div>
  );
}
