import { useContext } from 'react';
import ThemeContext from '../../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <header className="topbar navbar">
      <div className="brand">Pharma<span className="brand-accent">ERP</span></div>
      <div className="search-wrap">
        <input className="search-input" placeholder="Search medicines..." />
      </div>
      <div className="nav-actions">
        <button className="btn btn-secondary">Cart</button>
        <button className="btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'maroon' ? 'Light' : 'Maroon'}
        </button>
        <div className="avatar">A</div>
      </div>
    </header>
  );
}
