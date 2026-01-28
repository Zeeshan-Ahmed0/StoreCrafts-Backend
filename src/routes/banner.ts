import { Router } from "express";
import {
  createBanner,
  deleteBanner,
  listBanners,
  listPublicBanners,
  updateBanner,
} from "../controllers/bannerController.js";
import { authenticateJwt, requireRole, requireStoreScope } from "../middleware/auth.js";

const bannerRouter = Router();

bannerRouter.get("/public/:storeId", listPublicBanners);

bannerRouter.get(
  "/",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  listBanners
);
bannerRouter.post(
  "/",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  createBanner
);
bannerRouter.put(
  "/:bannerId",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  updateBanner
);
bannerRouter.delete(
  "/:bannerId",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  deleteBanner
);

export { bannerRouter };
