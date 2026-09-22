import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCapsules,
  FaSearch,
  FaShieldAlt,
  FaShoppingBag,
  FaTruck,
} from "react-icons/fa";

import { getMedicines } from "../../services/api";
import { addItem, getItem } from "../../utils/storage";

import "./Home.css";

export default function Home() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadMedicines() {
      try {
        const data = await getMedicines();
        setMedicines(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMedicines();
  }, []);

  const filtered = useMemo(
    () =>
      medicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(search.toLowerCase())
      ),
    [medicines, search]
  );

  const totalStock = useMemo(
    () => medicines.reduce((sum, item) => sum + Number(item.stock || 0), 0),
    [medicines]
  );

  const addToCart = (medicine) => {
    const cart = getItem("cart");
    const id = medicine._id || medicine.id;
    const exists = cart.find((item) => item.id === id);

    if (exists) {
      const updated = cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      localStorage.setItem("pharma-cart", JSON.stringify(updated));
    } else {
      addItem("cart", {
        id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1,
      });
    }

    alert("Added to cart");
  };

  const openMedicine = (medicine) => {
    navigate("/customer/medicine", { state: medicine });
  };

  return (
    <div className="home page-shell">
      <section className="home-hero">
        <div className="home-hero__content">
          <span className="badge">Trusted online pharmacy experience</span>
          <h1>Health essentials, organized for faster ordering.</h1>
          <p>
            Browse verified medicines, compare stock instantly, and order with
            a cleaner checkout flow from anywhere.
          </p>

          <div className="home-hero__actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => navigate("/customer/medicines")}
            >
              Browse Medicines
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                document.getElementById("home-products")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Explore Highlights
            </button>
          </div>
        </div>

        <div className="home-hero__aside">
          <div className="home-info-card">
            <div>
              <span className="soft-pill">Today&apos;s offer</span>
              <h3>Up to 20% off selected care products</h3>
            </div>
            <div className="home-info-card__stats">
              <div>
                <strong>{medicines.length}</strong>
                <span>Medicines</span>
              </div>
              <div>
                <strong>{totalStock}</strong>
                <span>Units in stock</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="home-strip">
        <article className="home-strip__card">
          <FaCapsules />
          <div>
            <h3>{medicines.length}</h3>
            <p>Medicines available</p>
          </div>
        </article>

        <article className="home-strip__card">
          <FaTruck />
          <div>
            <h3>Fast</h3>
            <p>Order processing flow</p>
          </div>
        </article>

        <article className="home-strip__card">
          <FaShieldAlt />
          <div>
            <h3>Secure</h3>
            <p>Protected checkout options</p>
          </div>
        </article>

        <article className="home-strip__card">
          <FaShoppingBag />
          <div>
            <h3>24/7</h3>
            <p>Access to your orders</p>
          </div>
        </article>
      </div>

      <section className="home-search panel" id="home-products">
        <div className="section-heading">
          <h2>Featured medicines</h2>
          <p>Search the catalog and jump into details quickly.</p>
        </div>

        <div className="home-search__box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </section>

      {error && <div className="error-text">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading medicines...</div>
      ) : (
        <div className="medicine-grid home-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">No medicines found.</div>
          ) : (
            filtered.map((medicine) => (
              <article
                className="medicine-card"
                key={medicine._id || medicine.id}
              >
                <div className="medicine-card__media">
                  <FaCapsules />
                </div>

                <div className="medicine-body">
                  <span
                    className={`status-chip ${
                      medicine.stock > 0 ? "success" : "danger"
                    }`}
                  >
                    {medicine.stock > 0 ? "In stock" : "Out of stock"}
                  </span>

                  <h3>{medicine.name}</h3>
                  <p className="price">Rs. {Number(medicine.price || 0).toFixed(2)}</p>
                  <p>Available stock: {medicine.stock}</p>

                  <div className="card-buttons">
                    <button type="button" onClick={() => openMedicine(medicine)}>
                      View
                    </button>
                    <button
                      type="button"
                      className="cart-btn"
                      onClick={() => addToCart(medicine)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      <section className="offer-banner">
        <div>
          <h2>Healthy living starts here</h2>
          <p>Save on everyday essentials with a calmer, faster buying experience.</p>
        </div>

        <button type="button" onClick={() => navigate("/customer/medicines")}>
          Shop Now
        </button>
      </section>
    </div>
  );
}
