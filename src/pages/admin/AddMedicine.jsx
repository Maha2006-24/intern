import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMedicine } from "../../services/api";
import "./MedicineForm.css";

export default function AddMedicine() {
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState({
    name: "",
    price: "",
    stock: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      await createMedicine({
        name: medicine.name,
        price: Number(medicine.price),
        stock: Number(medicine.stock)
      });

      alert("Medicine Added Successfully");

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

        <h1>Add Medicine</h1>

        <p>
          Fill the details below to add a new
          medicine.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Medicine Name</label>

          <input
            type="text"
            name="name"
            placeholder="Paracetamol"
            value={medicine.name}
            onChange={handleChange}
          />

          <label>Price</label>

          <input
            type="number"
            name="price"
            placeholder="100"
            value={medicine.price}
            onChange={handleChange}
          />

          <label>Stock</label>

          <input
            type="number"
            name="stock"
            placeholder="50"
            value={medicine.stock}
            onChange={handleChange}
          />

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="save-btn"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Medicine"}
          </button>

        </form>

      </div>

    </div>

  );

}