import { useEffect, useState } from "react";
import {
  FaBox,
  FaCapsules,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaDownload,
  FaMoneyBillWave,
} from "react-icons/fa";

import { getOrders } from "../../services/api";
import { getCurrentUserEmail } from "../../utils/auth";
import { downloadInvoice } from "../../utils/invoiceGenerator";

import "./MyOrders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const email = getCurrentUserEmail();

  useEffect(() => {
    if (!email) {
      setError("No logged in customer found.");
      return;
    }

    getOrders(email).then(setOrders).catch((err) => setError(err.message));
  }, [email]);

  return (
    <div className="orders-page page-shell">
      <section className="panel orders-hero-card">
        <div className="page-title">
          <span className="eyebrow">Order timeline</span>
          <h1>My orders</h1>
          <p>Track payments, item lines, and downloadable invoices from one organized view.</p>
        </div>
      </section>

      {error && <p className="error-text">{error}</p>}

      {!error && orders.length === 0 ? (
        <div className="empty-state">
          <h2>No orders found</h2>
          <p>You have not placed any orders yet.</p>
        </div>
      ) : (
        orders.map((order) => (
          <article className="order-card" key={order._id || order.id}>
            <div className="order-header">
              <div>
                <h3>Order #{order._id || order.id}</h3>
                <p>
                  {new Date(order.createdAt || Date.now()).toLocaleString("en-IN")}
                </p>
              </div>

              <span className="status">
                <FaBox />
                {order.status || "Processing"}
              </span>
            </div>

            <div className="order-items">
              {(order.items || []).map((item, index) => (
                <div className="item" key={index}>
                  <span>
                    <FaCapsules /> {item.name}
                  </span>
                  <span>{item.quantity} x Rs. {Number(item.price || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="payment-details">
              <div>
                <strong>Payment method</strong>
                <br />
                {order.paymentMethod === "Online Payment" ? (
                  <>
                    <FaCreditCard /> Online Payment
                  </>
                ) : (
                  <>
                    <FaMoneyBillWave /> Cash on Delivery
                  </>
                )}
              </div>

              <div>
                <strong>Payment status</strong>
                <br />
                {order.paymentStatus === "Paid" ? (
                  <span className="paid">
                    <FaCheckCircle /> Paid
                  </span>
                ) : (
                  <span className="pending">
                    <FaClock /> Pending
                  </span>
                )}
              </div>
            </div>

            {order.transactionId && (
              <div className="transaction">
                <strong>Transaction ID</strong>
                <p>{order.transactionId}</p>
              </div>
            )}

            <div className="order-footer">
              <h2>Total Rs. {Number(order.total || 0).toFixed(2)}</h2>
              <button
                type="button"
                className="invoice-btn"
                onClick={() =>
                  downloadInvoice({
                    customerName: order.customer,
                    email: order.customerEmail,
                    phone: "",
                    address: "",
                    invoiceNo: order._id || order.id,
                    payment: order.paymentMethod,
                    paymentStatus: order.paymentStatus,
                    transactionId: order.transactionId,
                    date: new Date(order.createdAt).toLocaleString(),
                    subTotal: order.total,
                    gst: "0",
                    delivery: "0",
                    total: order.total,
                    items: order.items,
                  })
                }
              >
                <FaDownload />
                Download Invoice
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
