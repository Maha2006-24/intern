import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateMedicine } from "../../services/api";
import "./MedicineForm.css";

export default function EditMedicine() {

  const navigate = useNavigate();
  const { state } = useLocation();

  const [medicine, setMedicine] = useState({
    name: state?.name || "",
    price: state?.price || "",
    stock: state?.stock || ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!state) {
    return (
      <div className="medicine-form-page">
        <div className="medicine-form-card">
          <h2>Medicine not found.</h2>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setMedicine({
      ...medicine,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (
      !medicine.name ||
      !medicine.price ||
      !medicine.stock
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {

      setLoading(true);

      await updateMedicine(state._id, {
        name: medicine.name,
        price: Number(medicine.price),
        stock: Number(medicine.stock)
      });

      alert("Medicine Updated Successfully");

      navigate("/admin/medicines");

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="medicine-form-page">

      <div className="medicine-form-card">

        <h1>Edit Medicine</h1>

        <p>
          Update medicine information.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Medicine Name</label>

          <input
            type="text"
            name="name"
            value={medicine.name}
            onChange={handleChange}
          />

          <label>Price</label>

          <input
            type="number"
            name="price"
            value={medicine.price}
            onChange={handleChange}
          />

          <label>Stock</label>

          <input
            type="number"
            name="stock"
            value={medicine.stock}
            onChange={handleChange}
          />

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            className="save-btn"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Medicine"}
          </button>

        </form>

      </div>

    </div>

  );

}