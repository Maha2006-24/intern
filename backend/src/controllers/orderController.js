import Order from "../models/Order.js";
import Medicine from "../models/Medicine.js";
import { isMongoConnected } from "../config/db.js";
import {
  createLegacyId,
  readLegacyData,
  writeLegacyData,
} from "../data/legacyStore.js";

/* ==========================================
   GET ORDERS
========================================== */

export async function listOrders(req, res) {
  try {
    const email = req.query.email;

    if (isMongoConnected()) {
      const orders = email
        ? await Order.find({ customerEmail: email }).sort({ createdAt: -1 })
        : await Order.find().sort({ createdAt: -1 });

      return res.json(orders);
    }

    const data = await readLegacyData();

    let orders = data.orders || [];

    if (email) {
      orders = orders.filter(
        (order) => order.customerEmail === email
      );
    }

    res.json(orders.reverse());

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

/* ==========================================
   CREATE ORDER
========================================== */

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

    const order = {
      customer,
      customerEmail,
      items,
      total,
      paymentMethod,
      paymentStatus,
      transactionId,
      status: "Processing",
    };

    /* ---------- MongoDB ---------- */

    if (isMongoConnected()) {
      for (const item of items) {
        await Medicine.findByIdAndUpdate(
          item.id,
          {
            $inc: {
              stock: -item.quantity,
            },
          }
        );
      }

      const newOrder = await Order.create(order);

      return res.status(201).json(newOrder);
    }

    /* ---------- Legacy JSON ---------- */

    const data = await readLegacyData();

    for (const item of items) {
      const medicine = data.medicines.find(
        (m) => m.id === item.id
      );

      if (medicine) {
        medicine.stock = Math.max(
          0,
          medicine.stock - item.quantity
        );
      }
    }

    const legacyOrder = {
      id: createLegacyId("o"),
      ...order,
    };

    data.orders = [
      legacyOrder,
      ...(data.orders || []),
    ];

    await writeLegacyData(data);

    return res.status(201).json(legacyOrder);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

/* ==========================================
   UPDATE ORDER
========================================== */

export async function updateOrder(req, res) {
  try {
    if (isMongoConnected()) {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      if (!order) {
        return res.status(404).json({
          error: "Order not found",
        });
      }

      return res.json(order);
    }

    const data = await readLegacyData();

    const index = (data.orders || []).findIndex(
      (o) => o.id === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    data.orders[index] = {
      ...data.orders[index],
      ...req.body,
    };

    await writeLegacyData(data);

    res.json(data.orders[index]);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

/* ==========================================
   DELETE ORDER
========================================== */

export async function deleteOrder(req, res) {
  try {
    if (isMongoConnected()) {
      await Order.findByIdAndDelete(req.params.id);

      return res.json({
        message: "Order deleted successfully",
      });
    }

    const data = await readLegacyData();

    data.orders = (data.orders || []).filter(
      (o) => o.id !== req.params.id
    );

    await writeLegacyData(data);

    res.json({
      message: "Order deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}