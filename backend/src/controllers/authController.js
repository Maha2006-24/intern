import Customer from '../models/Customer.js';
import { isMongoConnected } from '../config/db.js';
import { createLegacyId, readLegacyData, writeLegacyData } from '../data/legacyStore.js';
import { normalizeEmail, sanitizeCustomer } from '../utils/customers.js';
import { hashPassword, passwordsMatch } from '../utils/passwords.js';

const ADMIN_EMAIL = 'mahastudy9943@gmail.com';
const ADMIN_PASSWORD = '123';

function buildAuthResponse(role, user) {
  return {
    role,
    user: {
      ...user,
      role,
    },
  };
}

async function findCustomerByEmail(email) {
  if (isMongoConnected()) {
    return Customer.findOne({ email });
  }

  const data = await readLegacyData();
  return (data.customers || []).find((customer) => normalizeEmail(customer.email) === email) || null;
}

async function login(req, res) {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json(
      buildAuthResponse('admin', {
        name: 'Admin',
        email: ADMIN_EMAIL,
      })
    );
  }

  try {
    const customer = await findCustomerByEmail(email);

    if (!customer || !passwordsMatch(password, customer.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json(buildAuthResponse('customer', sanitizeCustomer(customer)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function register(req, res) {
  const name = String(req.body.name || '').trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');
  const phone = String(req.body.phone || '').trim();
  const address = String(req.body.address || '').trim();

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (email === ADMIN_EMAIL) {
    return res.status(400).json({ error: 'This email is reserved' });
  }

  try {
    const existingCustomer = await findCustomerByEmail(email);

    if (existingCustomer) {
      return res.status(409).json({ error: 'Customer already exists with this email' });
    }

    if (isMongoConnected()) {
      const customer = await Customer.create({
        name,
        email,
        passwordHash: hashPassword(password),
        phone,
        address,
      });

      return res.status(201).json(buildAuthResponse('customer', sanitizeCustomer(customer)));
    }

    const data = await readLegacyData();
    const customer = {
      id: createLegacyId('c'),
      name,
      email,
      passwordHash: hashPassword(password),
      phone,
      address,
    };

    data.customers = [customer, ...(data.customers || [])];
    await writeLegacyData(data);

    res.status(201).json(buildAuthResponse('customer', sanitizeCustomer(customer)));
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: 'Customer already exists with this email' });
    }

    res.status(500).json({ error: error.message });
  }
}

export { login, register };
