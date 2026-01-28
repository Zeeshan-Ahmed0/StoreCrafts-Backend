import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductDetail,
  listProducts,
  updateProduct,
} from "../controllers/productController.js";
import { authenticateJwt, requireRole, requireStoreScope } from "../middleware/auth.js";

const productRouter = Router();

productRouter.get("/", listProducts);
productRouter.get("/:productId", getProductDetail);
productRouter.post("/", authenticateJwt, requireRole("store_admin"), requireStoreScope, createProduct);
productRouter.put("/:productId", authenticateJwt, requireRole("store_admin"), requireStoreScope, updateProduct);
productRouter.delete("/:productId", authenticateJwt, requireRole("store_admin"), requireStoreScope, deleteProduct);

export { productRouter };
