import Customer from "../models/Customer.js";
import { isMongoConnected } from "../config/db.js";
import {
  createLegacyId,
  readLegacyData,
  writeLegacyData,
} from "../data/legacyStore.js";

import {
  normalizeEmail,
  sanitizeCustomer,
} from "../utils/customers.js";

import { hashPassword } from "../utils/passwords.js";

/* ===========================
   LIST CUSTOMERS
=========================== */

export async function listCustomers(req, res) {
  try {
    if (isMongoConnected()) {
      const customers = await Customer.find().sort({
        createdAt: -1,
      });

      return res.json(customers.map(sanitizeCustomer));
    }

    const data = await readLegacyData();

    const customers = [...(data.customers || [])]
      .reverse()
      .map(sanitizeCustomer);

    res.json(customers);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

/* ===========================
   GET CUSTOMER PROFILE
=========================== */

export async function getCustomerProfile(req, res) {
  try {
    const email = normalizeEmail(req.query.email);

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    if (isMongoConnected()) {
      const customer = await Customer.findOne({
        email,
      });

      if (!customer) {
        return res.status(404).json({
          error: "Customer not found",
        });
      }

      return res.json(sanitizeCustomer(customer));
    }

    const data = await readLegacyData();

    const customer = (data.customers || []).find(
      (c) => normalizeEmail(c.email) === email
    );

    if (!customer) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    res.json(sanitizeCustomer(customer));
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

/* ===========================
   CREATE CUSTOMER
=========================== */

export async function createCustomer(req, res) {
  try {
    const payload = {
      name: String(req.body.name || "").trim(),
      email: normalizeEmail(req.body.email),
      phone: String(req.body.phone || "").trim(),
      address: String(req.body.address || "").trim(),
      passwordHash: req.body.password
        ? hashPassword(req.body.password)
        : "",
    };

    if (!payload.name || !payload.email) {
      return res.status(400).json({
        error: "Name and Email are required",
      });
    }

    if (isMongoConnected()) {
      const customer = await Customer.create(payload);

      return res.status(201).json(
        sanitizeCustomer(customer)
      );
    }

    const data = await readLegacyData();

    const customer = {
      id: createLegacyId("c"),
      ...payload,
    };

    data.customers = [
      customer,
      ...(data.customers || []),
    ];

    await writeLegacyData(data);

    res.status(201).json(
      sanitizeCustomer(customer)
    );
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: "Customer already exists",
      });
    }

    res.status(500).json({
      error: error.message,
    });
  }
}

/* ===========================
   UPDATE CUSTOMER (ADMIN)
=========================== */

export async function updateCustomer(req, res) {
  try {
    const payload = {
      name: String(req.body.name || "").trim(),
      email: normalizeEmail(req.body.email),
      phone: String(req.body.phone || "").trim(),
      address: String(req.body.address || "").trim(),
    };

    if (isMongoConnected()) {
      const customer =
        await Customer.findByIdAndUpdate(
          req.params.id,
          payload,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!customer) {
        return res.status(404).json({
          error: "Customer not found",
        });
      }

      return res.json(
        sanitizeCustomer(customer)
      );
    }

    const data = await readLegacyData();

    const index =
      (data.customers || []).findIndex(
        (c) => c.id === req.params.id
      );

    if (index === -1) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    data.customers[index] = {
      ...data.customers[index],
      ...payload,
    };

    await writeLegacyData(data);

    res.json(
      sanitizeCustomer(
        data.customers[index]
      )
    );
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

/* ===========================
   UPDATE CUSTOMER PROFILE
=========================== */

export async function updateCustomerProfile(req, res) {
  try {
    const {
      email,
      name,
      phone,
      address,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const payload = {
      name: String(name || "").trim(),
      phone: String(phone || "").trim(),
      address: String(address || "").trim(),
    };

    if (isMongoConnected()) {
      const customer =
        await Customer.findOneAndUpdate(
          {
            email: normalizeEmail(email),
          },
          payload,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!customer) {
        return res.status(404).json({
          error: "Customer not found",
        });
      }

      return res.json(
        sanitizeCustomer(customer)
      );
    }

    const data = await readLegacyData();

    const index =
      (data.customers || []).findIndex(
        (customer) =>
          normalizeEmail(customer.email) ===
          normalizeEmail(email)
      );

    if (index === -1) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    data.customers[index] = {
      ...data.customers[index],
      ...payload,
    };

    await writeLegacyData(data);

    res.json(
      sanitizeCustomer(
        data.customers[index]
      )
    );
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

/* ===========================
   DELETE CUSTOMER
=========================== */

export async function deleteCustomer(req, res) {
  try {
    if (isMongoConnected()) {
      const customer =
        await Customer.findByIdAndDelete(
          req.params.id
        );

      if (!customer) {
        return res.status(404).json({
          error: "Customer not found",
        });
      }

      return res.json({
        message:
          "Customer deleted successfully",
      });
    }

    const data = await readLegacyData();

    data.customers = (data.customers || []).filter(
      (customer) => customer.id !== req.params.id
    );

    await writeLegacyData(data);

    res.json({
      message:
        "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}