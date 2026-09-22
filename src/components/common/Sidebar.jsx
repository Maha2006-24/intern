import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div style={{ fontWeight: 800, fontSize: 20 }}>PharmaERP</div>
      <nav className="nav-links" style={{ marginTop: 18 }}>
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/medicines">Medicines</NavLink>
        <NavLink to="/admin/suppliers">Suppliers</NavLink>
        <NavLink to="/admin/customers">Customers</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
        <NavLink to="/admin/reports">Reports</NavLink>
      </nav>
    </aside>
  );
}
