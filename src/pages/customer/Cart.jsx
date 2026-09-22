import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCapsules,
  FaMinus,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  function loadCart() {
    const items =
      JSON.parse(localStorage.getItem("pharma-cart")) || [];

    setCart(items);
  }

  function updateCart(items) {
    setCart(items);

    localStorage.setItem(
      "pharma-cart",
      JSON.stringify(items)
    );
  }

  function increase(id) {
    const updated = cart.map((item) => {
      if (item.id === id) {
        if (item.quantity >= item.stock) {
          alert("Maximum stock reached");
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }

      return item;
    });

    updateCart(updated);
  }

  function decrease(id) {
    const updated = cart
      .map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    updateCart(updated);
  }

  function removeItem(id) {
    if (!window.confirm("Remove this medicine?")) {
      return;
    }

    updateCart(
      cart.filter((item) => item.id !== id)
    );
  }

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  const delivery =
    subtotal === 0
      ? 0
      : subtotal > 1000
      ? 0
      : 50;

  const gst = subtotal * 0.05;

  const total =
    subtotal + delivery + gst;

  return (
    <div className="cart-page page-shell">

      <section className="panel cart-hero">
        <div className="page-title">
          <span className="eyebrow">
            Shopping Cart
          </span>

          <h1>Your Cart</h1>

          <p>
            Review your medicines before checkout.
          </p>
        </div>
      </section>

      {cart.length === 0 ? (
        <div className="empty-state">
          <h2>Cart is Empty</h2>

          <button
            className="checkout-btn"
            onClick={() =>
              navigate("/customer/medicines")
            }
          >
            Browse Medicines
          </button>
        </div>
      ) : (
        <div className="cart-layout">

          <div className="cart-items">

            {cart.map((item) => (
              <article
                className="cart-card"
                key={item.id}
              >
                <div className="cart-icon">
                  <FaCapsules />
                </div>

                <div className="cart-info">
                  <h3>{item.name}</h3>

                  <p>
                    Rs.
                    {Number(item.price).toFixed(2)}
                  </p>

                  <small>
                    Available :
                    {item.stock}
                  </small>
                </div>

                <div className="quantity">

                  <button
                    onClick={() =>
                      decrease(item.id)
                    }
                  >
                    <FaMinus />
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increase(item.id)
                    }
                    disabled={
                      item.quantity >= item.stock
                    }
                  >
                    <FaPlus />
                  </button>

                </div>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeItem(item.id)
                  }
                >
                  <FaTrash />

                  Remove
                </button>

              </article>
            ))}

          </div>

          <aside className="summary">

            <h2>Order Summary</h2>

            <div>
              <span>Subtotal</span>

              <span>
                Rs.
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div>
              <span>Delivery</span>

              <span>
                Rs.
                {delivery.toFixed(2)}
              </span>
            </div>

            <div>
              <span>GST (5%)</span>

              <span>
                Rs.
                {gst.toFixed(2)}
              </span>
            </div>

            <hr />

            <div className="total">

              <span>Total</span>

              <span>
                Rs.
                {total.toFixed(2)}
              </span>

            </div>

            <button
              className="checkout-btn"
              onClick={() =>
                navigate("/customer/checkout")
              }
            >
              Proceed to Checkout
            </button>

          </aside>

        </div>
      )}

    </div>
  );
}