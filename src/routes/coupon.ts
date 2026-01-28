import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  listCoupons,
  listPublicCoupons,
  updateCoupon,
  validateCoupon,
} from "../controllers/couponController.js";
import { authenticateJwt, requireRole, requireStoreScope } from "../middleware/auth.js";

const couponRouter = Router();

couponRouter.get("/public/:storeId", listPublicCoupons);
couponRouter.post("/public/:storeId/validate", validateCoupon);

couponRouter.get(
  "/",
  authenticateJwt,
  requireRole("store_owner"),
  requireStoreScope,
  listCoupons
);
couponRouter.post(
  "/",
  authenticateJwt,
  requireRole("store_owner"),
  requireStoreScope,
  createCoupon
);
couponRouter.put(
  "/:couponId",
  authenticateJwt,
  requireRole("store_owner"),
  requireStoreScope,
  updateCoupon
);
couponRouter.delete(
  "/:couponId",
  authenticateJwt,
  requireRole("store_owner"),
  requireStoreScope,
  deleteCoupon
);

export { couponRouter };
