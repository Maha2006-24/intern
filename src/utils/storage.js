const STORAGE_KEYS = {
  medicines: 'pharma-medicines',
  customers: 'pharma-customers',
  suppliers: 'pharma-suppliers',
  orders: 'pharma-orders',
  cart: 'pharma-cart',
};

const defaults = {
  medicines: [
    { id: 'm-101', name: 'Paracetamol', price: 45, stock: 120 },
    { id: 'm-102', name: 'Cough Syrup', price: 180, stock: 60 },
    { id: 'm-103', name: 'Vitamin C', price: 250, stock: 90 },
  ],
  customers: [
    { id: 'c-101', name: 'Anjali', email: 'anjali@example.com' },
    { id: 'c-102', name: 'Rahul', email: 'rahul@example.com' },
  ],
  suppliers: [
    { id: 's-101', name: 'HealthPlus Labs', city: 'Chennai' },
    { id: 's-102', name: 'MediCare Pvt Ltd', city: 'Bengaluru' },
  ],
  orders: [
    { id: 'o-101', customer: 'Anjali', total: 420, status: 'Pending' },
    { id: 'o-102', customer: 'Rahul', total: 180, status: 'Delivered' },
  ],
  cart: [
    { id: 'm-101', name: 'Paracetamol', price: 45, quantity: 2 },
  ],
};

function getItem(key) {
  const stored = localStorage.getItem(STORAGE_KEYS[key]);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(defaults[key] || []));
    return defaults[key] || [];
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(defaults[key] || []));
    return defaults[key] || [];
  }
}

function setItem(key, value) {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
}

function addItem(key, item) {
  const list = getItem(key);
  const next = [...list, item];
  setItem(key, next);
  return next;
}

function updateItem(key, id, patch) {
  const list = getItem(key);
  const next = list.map((item) => (item.id === id ? { ...item, ...patch } : item));
  setItem(key, next);
  return next;
}

function removeItem(key, id) {
  const list = getItem(key);
  const next = list.filter((item) => item.id !== id);
  setItem(key, next);
  return next;
}

export { STORAGE_KEYS, getItem, setItem, addItem, updateItem, removeItem };
