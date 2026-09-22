import { Router } from "express";
import {
  listOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = Router();

router.get("/", listOrders);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;