import { Router } from "express";
import { createCategory, listCategories } from "../controllers/categoryController.js";
import { authenticateJwt, requireRole, requireStoreScope } from "../middleware/auth.js";

const categoryRouter = Router();

categoryRouter.get("/", listCategories);
categoryRouter.post("/", authenticateJwt, requireRole("store_admin"), requireStoreScope, createCategory);

export { categoryRouter };
