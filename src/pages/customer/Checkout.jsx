import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

import { createOrder } from "../../services/api";
import { getUser } from "../../utils/auth";
import { downloadInvoice } from "../../utils/invoiceGenerator";

import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const user = getUser();
  const cart = JSON.parse(localStorage.getItem("pharma-cart")) || [];

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const delivery = subtotal > 1000 ? 0 : 50;
  const gst = subtotal * 0.05;
  const total = subtotal + delivery + gst;

  const placeOrder = async () => {
    setError("");

    if (!user?.email) {
      setError("No logged in customer found.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (paymentMethod === "Online Payment") {
  navigate("/customer/payment", {
    state: {
      user,
      cart,
      amount: total,
      subtotal,
      gst,
      delivery,
      invoiceNo: `INV-${Date.now()}`
    },
  });
  return;
}
    try {
      setSubmitting(true);

      const transactionId = "";

      await createOrder({
        customer: user.name,
        customerEmail: user.email,
        items: cart,
        total,
        paymentMethod: "Cash On Delivery",
        paymentStatus: "Pending",
        transactionId,
        status: "Processing",
      });

      downloadInvoice({
        customerName: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        invoiceNo: `INV-${Date.now()}`,
        payment: "Cash On Delivery",
        paymentStatus: "Pending",
        transactionId,
        date: new Date().toLocaleString(),
        subTotal: subtotal.toFixed(2),
        gst: gst.toFixed(2),
        delivery: delivery.toFixed(2),
        total: total.toFixed(2),
        items: cart,
      });

      localStorage.removeItem("pharma-cart");
      alert("Order placed successfully!");
      navigate("/customer/orders");
    } catch (err) {
      setError(err.message || "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page page-shell">
      <section className="panel checkout-hero">
        <div className="page-title">
          <span className="eyebrow">Checkout flow</span>
          <h1>Review and place your order</h1>
          <p>Confirm your saved details and choose the payment method that works for you.</p>
        </div>
      </section>

      <div className="checkout-grid">
        <div className="checkout-form">
          <h2>Customer details</h2>
          <input value={user?.name || ""} readOnly />
          <input value={user?.email || ""} readOnly />
          <input value={user?.phone || ""} readOnly />
          <textarea value={user?.address || ""} readOnly />
          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="order-summary">
          <h2>Order summary</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div className="summary-item" key={item.id}>
                <span>{item.name} x {item.quantity}</span>
                <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))
          )}

          <hr />

          <div className="summary-item">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Delivery</span>
            <span>Rs. {delivery.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>GST (5%)</span>
            <span>Rs. {gst.toFixed(2)}</span>
          </div>
          <div className="summary-item total">
            <span>Total</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>

          <hr />

          <div className="payment-box">
            <h2>Payment method</h2>

            <label className="payment-option">
              <input
                type="radio"
                value="Cash On Delivery"
                checked={paymentMethod === "Cash On Delivery"}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              <FaMoneyBillWave />
              Cash on Delivery
            </label>

            <label className="payment-option">
              <input
                type="radio"
                value="Online Payment"
                checked={paymentMethod === "Online Payment"}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              <FaCreditCard />
              Online Payment
            </label>
          </div>

          <button
            type="button"
            className="place-order-btn"
            onClick={placeOrder}
            disabled={submitting}
          >
            {submitting
              ? "Processing..."
              : paymentMethod === "Online Payment"
              ? "Pay Securely"
              : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
