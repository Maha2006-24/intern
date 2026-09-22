import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCapsules, FaStar } from "react-icons/fa";

import { addItem, getItem } from "../../utils/storage";

import "./MedicineDetails.css";

export default function MedicineDetails() {
  const navigate = useNavigate();
  const { state: medicine } = useLocation();

  if (!medicine) {
    return (
      <div className="details-page page-shell">
        <div className="empty-state">
          <h2>Medicine not found</h2>
          <button type="button" className="back-btn" onClick={() => navigate("/customer/medicines")}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const addToCart = () => {
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

    alert("Medicine added to cart");
  };

  return (
    <div className="details-page page-shell">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft />
        Back
      </button>

      <div className="details-card">
        <div className="details-image">
          <FaCapsules />
        </div>

        <div className="details-content">
          <span className={medicine.stock > 0 ? "stock in" : "stock out"}>
            {medicine.stock > 0 ? "In stock" : "Out of stock"}
          </span>
          <h1>{medicine.name}</h1>
          <div className="rating">
            <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
          </div>
          <h2 className="price">Rs. {Number(medicine.price || 0).toFixed(2)}</h2>
          <p><strong>Available stock:</strong> {medicine.stock}</p>
          <p className="description">
            This medicine is supplied through our trusted pharmacy network.
            Always use medicines only as prescribed by your healthcare professional.
          </p>
          <div className="button-group">
            <button type="button" className="cart-btn" onClick={addToCart}>
              Add to Cart
            </button>
            <button type="button" className="buy-btn" onClick={() => navigate("/customer/checkout")}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
