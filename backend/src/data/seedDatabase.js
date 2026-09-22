import Customer from '../models/Customer.js';
import Medicine from '../models/Medicine.js';
import Order from '../models/Order.js';
import Supplier from '../models/Supplier.js';
import { readLegacyData } from './legacyStore.js';
import { hashPassword } from '../utils/passwords.js';

function mapMedicine(record) {
  return {
    name: record.name,
    category: record.category || 'General',
    price: Number(record.price || 0),
    stock: Number(record.stock || 0),
    description: record.description || '',
    expiryDate: record.expiryDate || '',
  };
}

function mapCustomer(record) {
  return {
    name: record.name,
    email: record.email,
    passwordHash: record.passwordHash || (record.password ? hashPassword(record.password) : ''),
    phone: record.phone || '',
    address: record.address || '',
  };
}

function mapSupplier(record) {
  return {
    name: record.name,
    contactPerson: record.contactPerson || '',
    email: record.email || '',
    phone: record.phone || '',
    address: record.address || record.city || '',
    city: record.city || '',
  };
}

function mapOrder(record) {
  return {
    customer: record.customer,
    customerEmail: record.customerEmail || '',
    total: Number(record.total || 0),
    status: record.status || 'Pending',
    items: Array.isArray(record.items) ? record.items : [],
  };
}

async function seedDatabaseIfEmpty() {
  const [medicineCount, customerCount, supplierCount, orderCount] = await Promise.all([
    Medicine.countDocuments(),
    Customer.countDocuments(),
    Supplier.countDocuments(),
    Order.countDocuments(),
  ]);

  if (medicineCount && customerCount && supplierCount && orderCount) {
    return;
  }

  const legacyData = await readLegacyData();
  const operations = [];

  if (!medicineCount && legacyData.medicines?.length) {
    operations.push(Medicine.insertMany(legacyData.medicines.map(mapMedicine)));
  }

  if (!customerCount && legacyData.customers?.length) {
    operations.push(Customer.insertMany(legacyData.customers.map(mapCustomer)));
  }

  if (!supplierCount && legacyData.suppliers?.length) {
    operations.push(Supplier.insertMany(legacyData.suppliers.map(mapSupplier)));
  }

  if (!orderCount && legacyData.orders?.length) {
    operations.push(Order.insertMany(legacyData.orders.map(mapOrder)));
  }

  if (operations.length) {
    await Promise.all(operations);
    console.log('Seeded MongoDB from backend/db.json');
  }
}

export { seedDatabaseIfEmpty };
