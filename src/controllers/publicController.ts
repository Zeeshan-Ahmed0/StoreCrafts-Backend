import type { Request, Response } from "express";
import { Order, OrderItem, Product, Store, Variant } from "../models/index.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { applyStoreScope } from "../utils/storeScope.js";
import { requireFields } from "../utils/validation.js";

const listStoreProducts = async (req: Request, res: Response) => {
  const storeId = req.params.storeId;
  if (!storeId) {
    return sendError(res, "Store is required", 400);
  }
  const products = await Product.findAll({
    where: applyStoreScope(storeId, {}),
  });
  return sendSuccess(res, products, "Products");
};

const listProductVariants = async (req: Request, res: Response) => {
  const { storeId, productId } = req.params;
  if (!storeId || !productId) {
    return sendError(res, "Store and product are required", 400);
  }
  const product = await Product.findOne({
    where: applyStoreScope(storeId, { id: Number(productId) }),
  });
  if (!product) {
    return sendError(res, "Product not found", 404);
  }
  const variants = await Variant.findAll({ where: { productId: product.id } });
  return sendSuccess(res, variants, "Variants");
};

const createOrder = async (req: Request, res: Response) => {
  const storeId = req.params.storeId;
  if (!storeId) {
    return sendError(res, "Store is required", 400);
  }
  const missing = requireFields(req.body, [
    "name",
    "phone",
    "address",
    "items",
  ]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }

  const order = await Order.create({
    storeId,
    userId: req.body.userId ? Number(req.body.userId) : null,
    name: String(req.body.name),
    phone: String(req.body.phone),
    address: String(req.body.address),
    paymentMethod: "cod",
  });

  const items = Array.isArray(req.body.items) ? req.body.items : [];
  for (const item of items) {
    await OrderItem.create({
      orderId: order.id,
      productId: Number(item.productId),
      variantId: item.variantId ? Number(item.variantId) : null,
      name: String(item.name ?? ""),
      quantity: Number(item.quantity ?? 1),
      price: Number(item.price ?? 0),
      comparePrice: item.comparePrice ? Number(item.comparePrice) : null,
    });
  }

  return sendSuccess(res, { id: order.id }, "Order placed", 201);
};

const getStoreBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (!slug) {
    return sendError(res, "Slug is required", 400);
  }

  const store = await Store.findOne({
    where: { slug: String(slug) },
    attributes: ["id", "slug", "name", "subTitle", "description", "logo", "theme"],
  });

  if (!store) {
    return sendError(res, "Store not found", 404);
  }

  return sendSuccess(res, store, "Store details");
};

export { createOrder, getStoreBySlug, listProductVariants, listStoreProducts };
