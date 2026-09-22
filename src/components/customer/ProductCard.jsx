export default function ProductCard({ name, price, stock = 0, onAdd }) {
  const lowStock = stock !== undefined && stock <= 5;
  return (
    <div className="page-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0 }}>{name}</h3>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>₹{price}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div className={lowStock ? 'badge small' : 'badge small'} style={lowStock ? { background: 'linear-gradient(90deg,#fff1f2,#ffe9ea)', color: 'var(--primary-700)' } : {}}>
            {stock} left
          </div>
          <button className="btn btn-primary" onClick={onAdd} disabled={stock <= 0}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
