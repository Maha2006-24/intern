const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "/api" : "http://localhost:4000/api");

function buildHtmlResponseError(response, text) {
  const preview = text.slice(0, 80).replace(/\s+/g, " ").trim();

  const message =
    response.url?.includes("/api") || API_BASE.startsWith("/api")
      ? "API returned HTML instead of JSON. Make sure the backend server is running on http://localhost:4000."
      : "API returned HTML instead of JSON. Check VITE_API_BASE and backend routing.";

  return new Error(
    `${message}${preview ? ` Response preview: ${preview}` : ""}`
  );
}

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();

  const contentType = response.headers.get("content-type") || "";

  let data = null;

  if (text) {
    if (contentType.includes("application/json")) {
      data = JSON.parse(text);
    } else if (
      text.trim().startsWith("<!DOCTYPE") ||
      text.trim().startsWith("<html")
    ) {
      throw buildHtmlResponseError(response, text);
    } else {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Unexpected API response: ${text.slice(0, 120)}`
        );
      }
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || response.statusText);
  }

  return data;
}

/* ===========================
   AUTH
=========================== */

export function loginUser(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerCustomer(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* ===========================
   MEDICINES
=========================== */

export function getMedicines() {
  return request("/medicines");
}

export function getMedicine(id) {
  return request(`/medicines/${id}`);
}

export function createMedicine(payload) {
  return request("/medicines", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateMedicine(id, payload) {
  return request(`/medicines/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteMedicine(id) {
  return request(`/medicines/${id}`, {
    method: "DELETE",
  });
}

/* ===========================
   ORDERS
=========================== */

export function getOrders(email = "") {
  const query = email
    ? `?email=${encodeURIComponent(email)}`
    : "";

  return request(`/orders${query}`);
}

export function createOrder(payload) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateOrder(id, payload) {
  return request(`/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteOrder(id) {
  return request(`/orders/${id}`, {
    method: "DELETE",
  });
}

/* ===========================
   CUSTOMERS
=========================== */

export function getCustomers() {
  return request("/customers");
}

export function getCustomerProfile(email) {
  return request(
    `/customers/profile?email=${encodeURIComponent(email)}`
  );
}

export function updateCustomerProfile(payload) {
  return request("/customers/profile/update", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/* ===========================
   SUPPLIERS
=========================== */

export function getSuppliers() {
  return request("/suppliers");
}

export function createSupplier(payload) {
  return request("/suppliers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSupplier(id, payload) {
  return request(`/suppliers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteSupplier(id) {
  return request(`/suppliers/${id}`, {
    method: "DELETE",
  });
}