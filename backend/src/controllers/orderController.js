
import Order from "../models/Order.js";
import Medicine from "../models/Medicine.js";
import mongoose from "mongoose";
import { isMongoConnected } from "../config/db.js";
import {
  createLegacyId,
  readLegacyData,
  writeLegacyData,
} from "../data/legacyStore.js";

/* =========================
   GET ORDERS
========================= */

export async function listOrders(req, res) {
  try {
    if (isMongoConnected()) {
      const filter = req.query.email
        ? { customerEmail: req.query.email }
        : {};

      const orders = await Order.find(filter).sort({
        createdAt: -1,
      });

      return res.json(orders);
    }

    const data = await readLegacyData();
    let orders = data.orders || [];

    if (req.query.email) {
      orders = orders.filter(
        (order) => order.customerEmail === req.query.email
      );
    }

    return res.json([...orders].reverse());
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/* =========================
   CREATE ORDER
========================= */

export async function createOrder(req, res) {
  try {
    const {
      customer,
      customerEmail,
      items,
      total,
      paymentMethod,
      paymentStatus,
      transactionId,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Your order must contain at least one medicine.",
      });
    }

    for (const item of items) {
      if (
        !item.id ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) <= 0
      ) {
        return res.status(400).json({
          error: "Each item needs a valid medicine ID and quantity.",
        });
      }
    }

    const orderData = {
      customer,
      customerEmail,
      items,
      total: Number(total),
      paymentMethod,
      paymentStatus,
      transactionId,
      status: "Processing",
    };

    /* ---------- MongoDB ---------- */

    if (isMongoConnected()) {
      // Resolve both MongoDB ObjectIds and legacy IDs such as m-101.
      const resolvedItems = [];

      for (const item of items) {
        let medicine = null;

        if (mongoose.isValidObjectId(item.id)) {
          medicine = await Medicine.findById(item.id);
        }

        if (!medicine) {
          medicine = await Medicine.findOne({ id: item.id });
        }

        if (!medicine) {
          return res.status(404).json({
            error: `Medicine not found: ${item.name || item.id}`,
          });
        }

        const quantity = Number(item.quantity);

        if (Number(medicine.stock) < quantity) {
          return res.status(400).json({
            error: `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}`,
          });
        }

        resolvedItems.push({ medicine, quantity });
      }

      // Decrease stock only after every medicine has been validated.
      for (const { medicine, quantity } of resolvedItems) {
        const updated = await Medicine.findOneAndUpdate(
          {
            _id: medicine._id,
            stock: { $gte: quantity },
          },
          {
            $inc: { stock: -quantity },
          },
          { new: true }
        );

        if (!updated) {
          return res.status(409).json({
            error: `Stock changed while ordering ${medicine.name}. Please try again.`,
          });
        }
      }

      const newOrder = await Order.create(orderData);
      return res.status(201).json(newOrder);
    }

    /* ---------- Legacy JSON fallback ---------- */

    const data = await readLegacyData();
    const resolvedLegacyItems = [];

    for (const item of items) {
      const medicine = (data.medicines || []).find(
        (entry) => entry.id === item.id
      );

      if (!medicine) {
        return res.status(404).json({
          error: `Medicine not found: ${item.name || item.id}`,
        });
      }

      const quantity = Number(item.quantity);

      if (Number(medicine.stock) < quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${medicine.name}.`,
        });
      }

      resolvedLegacyItems.push({ medicine, quantity });
    }

    for (const { medicine, quantity } of resolvedLegacyItems) {
      medicine.stock -= quantity;
    }

    const legacyOrder = {
      id: createLegacyId("o"),
      ...orderData,
    };

    data.orders = [legacyOrder, ...(data.orders || [])];
    await writeLegacyData(data);

    return res.status(201).json(legacyOrder);
  } catch (error) {
    console.error("Create order failed:", error);

    return res.status(500).json({
      error: "Unable to place order. Please try again.",
    });
  }
}

/* =========================
   UPDATE ORDER
========================= */

export async function updateOrder(req, res) {
  try {
    if (isMongoConnected()) {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Invalid order ID." });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!order) {
        return res.status(404).json({ error: "Order not found." });
      }

      return res.json(order);
    }

    const data = await readLegacyData();
    const index = (data.orders || []).findIndex(
      (order) => order.id === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({ error: "Order not found." });
    }

    data.orders[index] = {
      ...data.orders[index],
      ...req.body,
    };

    await writeLegacyData(data);
    return res.json(data.orders[index]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/* =========================
   DELETE ORDER
========================= */

export async function deleteOrder(req, res) {
  try {
    if (isMongoConnected()) {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Invalid order ID." });
      }

      const order = await Order.findByIdAndDelete(req.params.id);

      if (!order) {
        return res.status(404).json({ error: "Order not found." });
      }

      return res.json({
        message: "Order deleted successfully.",
      });
    }

    const data = await readLegacyData();
    const existingOrders = data.orders || [];
    const exists = existingOrders.some(
      (order) => order.id === req.params.id
    );

    if (!exists) {
      return res.status(404).json({ error: "Order not found." });
    }

    data.orders = existingOrders.filter(
      (order) => order.id !== req.params.id
    );

    await writeLegacyData(data);

    return res.json({
      message: "Order deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
