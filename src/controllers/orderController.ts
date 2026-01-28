import type { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import { Order, OrderItem } from "../models/index.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { applyStoreScope } from "../utils/storeScope.js";
import { requireFields } from "../utils/validation.js";
import { sequelize } from "../config/dbConfig.js";

const listOrders = async (req: Request, res: Response) => {
  const { status, storeId, userId, sort } = req.query;
  const where: Record<string, unknown> = {};

  if (req.auth?.role === "store_admin") {
    where.storeId = req.storeId;
  } else if (storeId) {
    where.storeId = String(storeId);
  }

  if (status) {
    where.status = String(status);
  }
  if (userId) {
    where.userId = Number(userId);
  }

  const totalValueExpr = Sequelize.literal(
    "(SELECT COALESCE(SUM(oi.quantity * oi.price), 0) FROM order_items oi WHERE oi.order_id = orders.id)"
  );

  const orderClause: Array<
    [string | typeof totalValueExpr, "ASC" | "DESC"]
  > =
    sort === "total_value"
      ? [[totalValueExpr, "DESC"]]
      : sort === "date"
      ? [["createdAt", "ASC"]]
      : [["createdAt", "DESC"]];

  const orders = await Order.findAll({
    where,
    attributes: {
      include: [[totalValueExpr, "totalValue"]],
    },
    order: orderClause,
  });

  return sendSuccess(res, orders, "Orders");
};

const getOrderDetail = async (req: Request, res: Response) => {
  const orderId = Number(req.params.orderId);
  if (!orderId) {
    return sendError(res, "Invalid order id", 400);
  }

  const where =
    req.auth?.role === "store_admin"
      ? applyStoreScope(req.storeId!, { id: orderId })
      : { id: orderId };

  const order = await Order.findOne({
    where,
    include: [{ model: OrderItem, as: "items" }],
  });

  if (!order) {
    return sendError(res, "Order not found", 404);
  }

  return sendSuccess(res, order, "Order detail");
};

const createOrder = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ["storeId", "name", "phone", "address", "items"]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }

  const storeId =
    req.auth?.role === "store_admin" ? req.storeId : String(req.body.storeId);

  if (!storeId) {
    return sendError(res, "Store is required", 400);
  }

  const items = Array.isArray(req.body.items) ? req.body.items : [];

  const order = await sequelize.transaction(async (trx) => {
    const created = await Order.create(
      {
        storeId,
        userId: req.body.userId ? Number(req.body.userId) : null,
        name: String(req.body.name),
        phone: String(req.body.phone),
        address: String(req.body.address),
        paymentMethod: req.body.paymentMethod ? String(req.body.paymentMethod) : "cod",
        status: "pending",
      },
      { transaction: trx }
    );

    if (items.length) {
      const rows = items.map((item: Record<string, unknown>) => ({
        orderId: created.id,
        productId: Number(item.productId),
        variantId: item.variantId ? Number(item.variantId) : null,
        name: String(item.name ?? ""),
        quantity: Number(item.quantity ?? 1),
        price: Number(item.price ?? 0),
        comparePrice: item.comparePrice ? Number(item.comparePrice) : null,
      }));
      await OrderItem.bulkCreate(rows, { transaction: trx });
    }

    return created;
  });

  return sendSuccess(res, order, "Order created", 201);
};

const cancelOrder = async (req: Request, res: Response) => {
  const orderId = Number(req.params.orderId);
  if (!orderId) {
    return sendError(res, "Invalid order id", 400);
  }

  const where =
    req.auth?.role === "store_admin"
      ? applyStoreScope(req.storeId!, { id: orderId })
      : { id: orderId };

  const order = await Order.findOne({ where });
  if (!order) {
    return sendError(res, "Order not found", 404);
  }
  if (order.status !== "pending") {
    return sendError(res, "Only pending orders can be cancelled", 400);
  }

  await order.update({ status: "cancelled" });
  return sendSuccess(res, order, "Order cancelled");
};

export { cancelOrder, createOrder, getOrderDetail, listOrders };
