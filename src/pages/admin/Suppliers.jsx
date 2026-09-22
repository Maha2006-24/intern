import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaPlus, FaSearch, FaTrash, FaTruck } from "react-icons/fa";

import { deleteSupplier, getSuppliers } from "../../services/api";

import "./Suppliers.css";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function removeSupplier(id) {
    if (!window.confirm("Delete this supplier?")) {
      return;
    }

    try {
      await deleteSupplier(id);
      loadSuppliers();
    } catch (error) {
      alert(error.message);
    }
  }

  const filtered = useMemo(
    () =>
      suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, suppliers]
  );

  const citiesCovered = new Set(
    suppliers.map((supplier) => supplier.city).filter(Boolean)
  ).size;

  return (
    <div className="suppliers-page page-shell">
      <section className="panel suppliers-header-card">
        <div className="page-title">
          <span className="eyebrow">Vendor directory</span>
          <h1>Supplier management</h1>
          <p>Organize pharmacy partners, delivery contacts, and service coverage.</p>
        </div>
      </section>

      <div className="suppliers-stats">
        <div className="page-card supplier-stat-card">
          <h2>{suppliers.length}</h2>
          <p>Total suppliers</p>
        </div>
        <div className="page-card supplier-stat-card">
          <h2>{citiesCovered}</h2>
          <p>Cities covered</p>
        </div>
      </div>

      <div className="supplier-toolbar">
        <div className="supplier-search-wrap">
          <FaSearch />
          <input
            className="supplier-search"
            placeholder="Search supplier..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <Link to="/admin/suppliers/add" className="add-btn">
          <FaPlus />
          Add Supplier
        </Link>
      </div>

      <div className="table-panel suppliers-table-panel">
        <div className="table-scroll">
          <table className="data-table suppliers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="suppliers-empty">No suppliers found.</td>
                </tr>
              ) : (
                filtered.map((supplier) => (
                  <tr key={supplier._id}>
                    <td>
                      <div className="supplier-name">
                        <span className="supplier-icon">
                          <FaTruck />
                        </span>
                        {supplier.name}
                      </div>
                    </td>
                    <td>{supplier.email || "-"}</td>
                    <td>{supplier.phone || "-"}</td>
                    <td>{supplier.company || "-"}</td>
                    <td>{supplier.city || "-"}</td>
                    <td>
                      <div className="supplier-actions">
                        <Link to="/admin/suppliers/edit" state={supplier} className="edit-btn">
                          <FaEdit />
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => removeSupplier(supplier._id)}
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
    </div>
  );
}
