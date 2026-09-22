import { useEffect, useState } from 'react';
import { getCustomers } from '../../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="page-stack">
      <div className="page-card">
        <h2>Customers</h2>
        {error && <p className="error-text">{error}</p>}
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id || customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
