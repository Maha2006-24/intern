function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function sanitizeCustomer(customer) {
  if (!customer) {
    return null;
  }

  const plainCustomer =
    typeof customer.toObject === 'function' ? customer.toObject() : { ...customer };

  const { passwordHash, ...safeCustomer } = plainCustomer;
  return safeCustomer;
}

export { normalizeEmail, sanitizeCustomer };
