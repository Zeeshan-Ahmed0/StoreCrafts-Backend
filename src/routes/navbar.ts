import { Router } from "express";
import {
  createNavbarOption,
  deleteNavbarOption,
  listNavbarOptions,
  listPublicNavbarOptions,
  reorderNavbarOptions,
  updateNavbarOption,
} from "../controllers/navbarController.js";
import { authenticateJwt, requireRole, requireStoreScope } from "../middleware/auth.js";

const navbarRouter = Router();

navbarRouter.get(
  "/public/:storeId",
  listPublicNavbarOptions
);

navbarRouter.get(
  "/",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  listNavbarOptions
);
navbarRouter.post(
  "/",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  createNavbarOption
);
navbarRouter.put(
  "/:optionId",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  updateNavbarOption
);
navbarRouter.delete(
  "/:optionId",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  deleteNavbarOption
);
navbarRouter.put(
  "/reorder",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  reorderNavbarOptions
);

export { navbarRouter };
