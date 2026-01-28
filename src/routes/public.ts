import { Router } from "express";
import {
  createOrder,
  listProductVariants,
  listStoreProducts,
} from "../controllers/publicController.js";

const publicRouter = Router();

publicRouter.get("/stores/:storeId/products", listStoreProducts);
publicRouter.get(
  "/stores/:storeId/products/:productId/variants",
  listProductVariants
);
publicRouter.post("/stores/:storeId/orders", createOrder);

export { publicRouter };
