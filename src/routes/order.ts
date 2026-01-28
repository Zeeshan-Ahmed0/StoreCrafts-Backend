import { Router } from "express";
import {
  cancelOrder,
  createOrder,
  getOrderDetail,
  listOrders,
} from "../controllers/orderController.js";
import { authenticateJwt, requireRole } from "../middleware/auth.js";

const orderRouter = Router();

orderRouter.use(authenticateJwt, requireRole("super_admin", "store_admin"));

orderRouter.get("/", listOrders);
orderRouter.get("/:orderId", getOrderDetail);
orderRouter.post("/", createOrder);
orderRouter.post("/:orderId/cancel", cancelOrder);

export { orderRouter };
