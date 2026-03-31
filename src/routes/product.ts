import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductDetail,
  listProducts,
  updateProduct,
} from "../controllers/productController.js";
import { authenticateJwt, requireRole, requireStoreScope } from "../middleware/auth.js";
import { resolveStoreSlug } from "../middleware/storeResolver.js";

const productRouter = Router();

// GET routes support both JWT (admin) and public (storefront) access with store_slug
productRouter.get("/", resolveStoreSlug, listProducts);
productRouter.get("/:productId", resolveStoreSlug, getProductDetail);
productRouter.post("/", authenticateJwt, requireRole("store_admin"), requireStoreScope, createProduct);
productRouter.put("/:productId", authenticateJwt, requireRole("store_admin"), requireStoreScope, updateProduct);
productRouter.delete("/:productId", authenticateJwt, requireRole("store_admin"), requireStoreScope, deleteProduct);

export { productRouter };
