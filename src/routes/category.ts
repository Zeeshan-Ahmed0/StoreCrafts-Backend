import { Router } from "express";
import { createCategory, listCategories } from "../controllers/categoryController.js";
import { authenticateJwt, requireRole, requireStoreScope } from "../middleware/auth.js";
import { resolveStoreSlug } from "../middleware/storeResolver.js";

const categoryRouter = Router();

// GET routes support both JWT (admin) and public (storefront) access with store_slug
categoryRouter.get("/", resolveStoreSlug, listCategories);
categoryRouter.post("/", authenticateJwt, requireRole("store_admin"), requireStoreScope, createCategory);

export { categoryRouter };
