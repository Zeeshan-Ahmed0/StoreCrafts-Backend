import type { Request, Response } from "express";
import { Op } from "sequelize";
import { Order, OrderItem, Review } from "../models/index.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { applyStoreScope } from "../utils/storeScope.js";
import { requireFields } from "../utils/validation.js";

const listReviews = async (req: Request, res: Response) => {
  const { storeId, rating, withImage, sort } = req.query;

  const scopedStoreId =
    req.auth?.role === "store_admin" ? req.storeId : storeId?.toString();

  if (!scopedStoreId) {
    return sendError(res, "storeId is required", 400);
  }

  const where: Record<string | symbol, unknown> = applyStoreScope(
    scopedStoreId,
    {}
  ) as Record<string | symbol, unknown>;

  if (rating) {
    where.rating = Number(rating);
  }
  if (withImage !== undefined) {
    if (String(withImage).toLowerCase() === "true") {
      where.image = { [Op.not]: null };
    }
  }

  const orderBy: Array<[string, "ASC" | "DESC"]> =
    sort === "rating" ? [["rating", "DESC"]] : [["createdAt", "DESC"]];

  const reviews = await Review.findAll({ where, order: orderBy });
  return sendSuccess(res, reviews, "Reviews");
};

const createReview = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ["storeId", "orderItemId", "rating"]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }

  const storeId = String(req.body.storeId);
  const orderItemId = Number(req.body.orderItemId);

  const orderItem = (await OrderItem.findByPk(orderItemId, {
    include: [{ model: Order, as: "order" }],
  })) as OrderItem & { order?: Order };

  if (!orderItem || orderItem.order?.storeId !== storeId) {
    return sendError(res, "Order item not found for store", 404);
  }

  const existing = await Review.findOne({ where: { orderItemId } });
  if (existing) {
    return sendError(res, "Review already exists for this order item", 400);
  }

  const review = await Review.create({
    storeId,
    productId: orderItem.productId,
    orderItemId,
    userId: req.body.userId ? Number(req.body.userId) : null,
    rating: Number(req.body.rating),
    comment: req.body.comment ? String(req.body.comment) : null,
    image: req.body.image ? String(req.body.image) : null,
    isApproved: false,
  });

  return sendSuccess(res, review, "Review created", 201);
};

export { createReview, listReviews };
