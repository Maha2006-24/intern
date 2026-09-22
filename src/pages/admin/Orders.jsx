import { useEffect, useMemo, useState } from "react";

import { deleteOrder, getOrders, updateOrder } from "../../services/api";

import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      alert(error.message);
    }
  }

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const customer = order.customer?.name || order.customer || "";
        return customer.toLowerCase().includes(search.toLowerCase());
      }),
    [orders, search]
  );

  async function changeStatus(id, status) {
    try {
      await updateOrder(id, { status });
      loadOrders();
    } catch (error) {
      alert(error.message);
    }
  }

  async function removeOrder(id) {
    if (!window.confirm("Delete this order?")) {
      return;
    }

    try {
      await deleteOrder(id);
      loadOrders();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="orders-page page-shell">
      <section className="panel orders-hero">
        <div className="page-title">
          <span className="eyebrow">Fulfillment</span>
          <h1>Order management</h1>
          <p>Search by customer, update status, and keep deliveries moving.</p>
        </div>
      </section>

      <div className="orders-toolbar">
        <input
          className="order-search"
          placeholder="Search customer..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="table-panel orders-table-panel">
        <div className="table-scroll">
          <table className="data-table orders-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="orders-empty">No orders found.</td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order._id}>
                    <td>{order.customer?.name || order.customer || "-"}</td>
                    <td>Rs. {Number(order.total || 0).toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(event) => changeStatus(order._id, event.target.value)}
                      >
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => removeOrder(order._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
