import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCapsules,
  FaSearch,
  FaShoppingCart,
  FaEye,
} from "react-icons/fa";

import { getMedicines } from "../../services/api";
import { getItem } from "../../utils/storage";

import "./Medicines.css";

export default function Medicines() {
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedicines();
  }, []);

  async function loadMedicines() {
    try {
      setLoading(true);
      const data = await getMedicines();
      setMedicines(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return medicines.filter((medicine) =>
      medicine.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [medicines, search]);

  function addToCart(medicine) {
    let cart = getItem("cart");

    if (!Array.isArray(cart)) {
      cart = [];
    }

    const id = medicine._id || medicine.id;

    const index = cart.findIndex(
      (item) => item.id === id
    );

    if (index >= 0) {
      cart[index].quantity += 1;
    } else {
      cart.push({
        id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "pharma-cart",
      JSON.stringify(cart)
    );

    alert("Medicine added to cart");
  }

  function openMedicine(medicine) {
    navigate("/customer/medicine", {
      state: medicine,
    });
  }

  return (
    <div className="medicine-page">

      <div className="hero-card">

        <span className="hero-badge">
          Browse Catalog
        </span>

        <h1>
          Available Medicines
        </h1>

        <p>
          Search medicines and add them to your cart.
        </p>

        <div className="search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search medicine..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

      </div>

      {loading ? (

        <div className="loading">
          Loading medicines...
        </div>

      ) : (

        <div className="medicine-grid">

          {filtered.length === 0 ? (

            <div className="empty-box">
              No medicines found
            </div>

          ) : (

            filtered.map((medicine) => (

              <div
                className="medicine-card"
                key={medicine._id || medicine.id}
              >

                <div className="top-row">

                  <div className="icon-box">
                    <FaCapsules />
                  </div>

                  <span
                    className={
                      Number(medicine.stock) > 10
                        ? "stock good"
                        : Number(medicine.stock) > 0
                        ? "stock low"
                        : "stock out"
                    }
                  >
                    {Number(medicine.stock) > 0
                      ? `${medicine.stock} Left`
                      : "Out of Stock"}
                  </span>

                </div>

                <h2>
                  {medicine.name}
                </h2>

                <div className="category">
                  {medicine.category || "General"}
                </div>

                <div className="price">
                  ₹ {Number(
                    medicine.price || 0
                  ).toFixed(2)}
                </div>

                <p className="description">
                  {medicine.description
                    ? medicine.description
                    : "No description available."}
                </p>

                <div className="card-buttons">

                  <button
                    className="view-btn"
                    onClick={() =>
                      openMedicine(medicine)
                    }
                  >
                    <FaEye />
                    View
                  </button>

                  <button
                    className="cart-btn"
                    disabled={medicine.stock <= 0}
                    onClick={() =>
                      addToCart(medicine)
                    }
                  >
                    <FaShoppingCart />
                    Add to Cart
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      )}

    </div>
  );
}