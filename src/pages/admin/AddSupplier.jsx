import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSupplier } from "../../services/api";
import "./SupplierForm.css";

export default function AddSupplier() {

  const navigate = useNavigate();

  const [supplier, setSupplier] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: ""
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {

    setSupplier({
      ...supplier,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if(
      !supplier.name ||
      !supplier.contactPerson ||
      !supplier.phone
    ){

      setError("Please fill all required fields.");

      return;

    }

    try{

      setLoading(true);

      await createSupplier(supplier);

      alert("Supplier Added Successfully");

      navigate("/admin/suppliers");

    }catch(err){

      setError(err.message);

    }finally{

      setLoading(false);

    }

  };

  return(

    <div className="supplier-form-page">

      <div className="supplier-form-card">

        <h1>Add Supplier</h1>

        <form onSubmit={handleSubmit}>

          <label>Supplier Name</label>

          <input
            name="name"
            value={supplier.name}
            onChange={handleChange}
          />

          <label>Contact Person</label>

          <input
            name="contactPerson"
            value={supplier.contactPerson}
            onChange={handleChange}
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={supplier.email}
            onChange={handleChange}
          />

          <label>Phone</label>

          <input
            name="phone"
            value={supplier.phone}
            onChange={handleChange}
          />

          <label>Address</label>

          <textarea
            name="address"
            value={supplier.address}
            onChange={handleChange}
          />

          <label>City</label>

          <input
            name="city"
            value={supplier.city}
            onChange={handleChange}
          />

          {error &&

            <p className="form-error">

              {error}

            </p>

          }

          <button
            className="save-btn"
            disabled={loading}
          >

            {loading
            ? "Saving..."
            : "Save Supplier"}

          </button>

        </form>

      </div>

    </div>

  );

}