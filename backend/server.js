import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 4000;
const dataPath = path.resolve('backend', 'db.json');

app.use(cors());
app.use(express.json());

function readData() {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

app.get('/api/summary', (req, res) => {
  const data = readData();
  res.json({
    medicines: data.medicines.length,
    customers: data.customers.length,
    suppliers: data.suppliers.length,
    orders: data.orders.length,
    cart: data.cart.reduce((sum, item) => sum + item.quantity, 0),
  });
});

app.get('/api/medicines', (req, res) => {
  const data = readData();
  res.json(data.medicines);
});

app.get('/api/suppliers', (req, res) => {
  const data = readData();
  res.json(data.suppliers);
});

app.get('/api/customers', (req, res) => {
  const data = readData();
  res.json(data.customers);
});

app.get('/api/orders', (req, res) => {
  const data = readData();
  res.json(data.orders);
});

app.get('/api/cart', (req, res) => {
  const data = readData();
  res.json(data.cart);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'mahastudy9943@gmail.com' && password === '123') {
    return res.json({ role: 'admin' });
  }
  return res.json({ role: 'customer' });
});

app.post('/api/cart', (req, res) => {
  const data = readData();
  const item = req.body;
  const existing = data.cart.find((cartItem) => cartItem.id === item.id);

  if (existing) {
    data.cart = data.cart.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
        : cartItem
    );
  } else {
    data.cart.push(item);
  }

  writeData(data);
  res.json(data.cart);
});

app.put('/api/cart/:id', (req, res) => {
  const data = readData();
  const { id } = req.params;
  const { quantity } = req.body;
  data.cart = data.cart.map((cartItem) =>
    cartItem.id === id ? { ...cartItem, quantity } : cartItem
  );
  writeData(data);
  res.json(data.cart);
});

app.delete('/api/cart/:id', (req, res) => {
  const data = readData();
  const { id } = req.params;
  data.cart = data.cart.filter((item) => item.id !== id);
  writeData(data);
  res.json(data.cart);
});

app.post('/api/checkout', (req, res) => {
  const data = readData();
  const newOrder = {
    id: `o-${Date.now()}`,
    customer: req.body.customer || 'Guest',
    total: req.body.total || 0,
    status: 'Pending',
  };
  data.orders.push(newOrder);
  data.cart = [];
  writeData(data);
  res.json(newOrder);
});

app.listen(port, () => {
  console.log(`Pharma backend listening at http://localhost:${port}`);
});
