import { Router } from "express";
import { createReview, listReviews } from "../controllers/reviewController.js";
import { authenticateJwt, requireRole } from "../middleware/auth.js";
import { resolveStoreSlug } from "../middleware/storeResolver.js";

const reviewRouter = Router();

reviewRouter.get("/", resolveStoreSlug, authenticateJwt, requireRole("super_admin", "store_admin"), listReviews);
reviewRouter.post("/", createReview);

export { reviewRouter };
