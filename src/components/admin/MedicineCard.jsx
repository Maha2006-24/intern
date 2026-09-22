export default function MedicineCard({ name, stock = 0, expiry }) {
  const lowStock = stock !== undefined && stock <= 5;
  return (
    <div className="page-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{name}</div>
          {expiry && <div style={{ color: 'var(--muted)', fontSize: 13 }}>{expiry}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className={lowStock ? 'badge small' : 'badge small'} style={lowStock ? { background: 'linear-gradient(90deg,#fff1f2,#ffe9ea)', color: 'var(--primary-700)' } : {}}>
            {stock} in stock
          </div>
          <button className="btn btn-primary">Edit</button>
        </div>
      </div>
    </div>
  );
}
