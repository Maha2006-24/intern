import { Router } from "express";

import {
  listCustomers,
  getCustomerProfile,
  createCustomer,
  updateCustomer,
  updateCustomerProfile,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = Router();

/* ===========================
   CUSTOMER PROFILE
=========================== */

// Get logged-in customer profile
router.get("/profile", getCustomerProfile);

// Update logged-in customer profile
router.put("/profile/update", updateCustomerProfile);

/* ===========================
   ADMIN CUSTOMER MANAGEMENT
=========================== */

// Get all customers
router.get("/", listCustomers);

// Create customer
router.post("/", createCustomer);

// Update customer by ID
router.put("/:id", updateCustomer);

// Delete customer by ID
router.delete("/:id", deleteCustomer);

export default router;