import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCapsules,
  FaEdit,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

import { deleteMedicine, getMedicines } from "../../services/api";

import "./Medicines.css";

export default function Medicines() {
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(
    () =>
      medicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(search.toLowerCase())
      ),
    [medicines, search]
  );

  async function removeMedicine(id) {
    if (!window.confirm("Delete this medicine?")) {
      return;
    }

    try {
      await deleteMedicine(id);
      loadMedicines();
    } catch (error) {
      alert(error.message);
    }
  }

  const totalStock = medicines.reduce(
    (sum, item) => sum + Number(item.stock || 0),
    0
  );
  const lowStock = medicines.filter((item) => Number(item.stock || 0) < 10).length;
  const healthyStock = medicines.length - lowStock;

  return (
    <div className="medicines-page page-shell">
      <section className="panel medicines-header-card">
        <div className="page-title">
          <span className="eyebrow">Inventory</span>
          <h1>Medicine management</h1>
          <p>Review stock, pricing, and edits in one cleaner workspace.</p>
        </div>
      </section>

      <div className="stats-grid medicines-stats-grid">
        <div className="stat-card">
          <h2>{medicines.length}</h2>
          <p>Total medicines</p>
        </div>
        <div className="stat-card">
          <h2>{totalStock}</h2>
          <p>Total stock units</p>
        </div>
        <div className="stat-card">
          <h2>{lowStock}</h2>
          <p>Low stock items</p>
        </div>
        <div className="stat-card">
          <h2>{healthyStock}</h2>
          <p>Well stocked items</p>
        </div>
      </div>

      <div className="action-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <Link to="/admin/medicines/add" className="add-btn">
          <FaPlus />
          Add Medicine
        </Link>
      </div>

      {loading ? (
        <div className="loading-state">Loading medicines...</div>
      ) : (
        <div className="table-wrapper table-panel">
          <div className="table-scroll">
            <table className="medicine-table data-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty">No medicines found</td>
                  </tr>
                ) : (
                  filtered.map((medicine) => (
                    <tr key={medicine._id}>
                      <td>
                        <div className="medicine-name">
                          <div className="medicine-icon">
                            <FaCapsules />
                          </div>
                          {medicine.name}
                        </div>
                      </td>
                      <td className="price">Rs. {Number(medicine.price || 0).toFixed(2)}</td>
                      <td>
                        <span
                          className={
                            Number(medicine.stock || 0) === 0
                              ? "stock-badge stock-out"
                              : Number(medicine.stock || 0) < 10
                              ? "stock-badge stock-low"
                              : "stock-badge stock-high"
                          }
                        >
                          {medicine.stock}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to="/admin/medicines/edit"
                            state={medicine}
                            className="edit-btn"
                          >
                            <FaEdit />
                            Edit
                          </Link>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => removeMedicine(medicine._id)}
                          >
                            <FaTrash />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
