import { Router } from "express";
import { getStoreOverview } from "../controllers/storeController.js";
import {
  authenticateJwt,
  requireRole,
  requireStoreScope,
} from "../middleware/auth.js";

const storeRouter = Router();

storeRouter.use(authenticateJwt, requireRole("store_admin"), requireStoreScope);

storeRouter.get("/overview", getStoreOverview);

export { storeRouter };
