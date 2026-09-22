export default function CartItem({ name, price }) {
  return <div className="page-card">{name} - ₹{price}</div>;
}
