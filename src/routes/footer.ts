import { Router } from "express";
import {
  createFooter,
  deleteFooter,
  listFooters,
  listPublicFooters,
  updateFooter,
} from "../controllers/footerController.js";
import { authenticateJwt, requireRole, requireStoreScope } from "../middleware/auth.js";

const footerRouter = Router();

footerRouter.get("/public/:storeId", listPublicFooters);

footerRouter.get(
  "/",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  listFooters
);
footerRouter.post(
  "/",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  createFooter
);
footerRouter.put(
  "/:footerId",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  updateFooter
);
footerRouter.delete(
  "/:footerId",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  deleteFooter
);

export { footerRouter };
