import type { Request, Response } from "express";
import { Admin, Order, Store, User } from "../models/index.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { isEmail, requireFields } from "../utils/validation.js";
import { hashPassword } from "../utils/password.js";
import { sequelize } from "../config/dbConfig.js";

const getDashboardAnalytics = async (req: Request, res: Response) => {
  const storeId = req.query.storeId ? String(req.query.storeId) : null;

  const storeWhere = storeId ? { id: storeId } : undefined;
  const scopedStoreWhere = storeId ? { storeId } : undefined;

  const [totalStores, totalUsers, totalOrders] = await Promise.all([
    Store.count({ where: storeWhere ?? {} }),
    User.count({ where: scopedStoreWhere ?? {} }),
    Order.count({ where: scopedStoreWhere ?? {} }),
  ]);

  const revenueQuery = storeId
    ? `
      SELECT COALESCE(SUM(oi.quantity * oi.price), 0) AS revenue
      FROM order_items oi
      INNER JOIN orders o ON o.id = oi.order_id
      WHERE o.store_id = :storeId
    `
    : `
      SELECT COALESCE(SUM(oi.quantity * oi.price), 0) AS revenue
      FROM order_items oi
      INNER JOIN orders o ON o.id = oi.order_id
    `;

  const revenueResult = await sequelize.query(revenueQuery, {
    replacements: storeId ? { storeId } : {},
    plain: true,
  });

  const totalRevenue = Number(
    (revenueResult as { revenue?: string | number })?.revenue ?? 0
  );

  return sendSuccess(
    res,
    { totalStores, totalUsers, totalOrders, totalRevenue },
    "Dashboard analytics"
  );
};

const createAdmin = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ["email", "password", "role"]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }

  const email = String(req.body.email).toLowerCase();
  if (!isEmail(email)) {
    return sendError(res, "Invalid email", 400);
  }

  const role = String(req.body.role);
  if (!["super_admin", "store_admin", "store_owner"].includes(role)) {
    return sendError(res, "Invalid role", 400);
  }

  const password = await hashPassword(String(req.body.password));
  const admin = await Admin.create({
    email,
    password,
    role: role as "super_admin" | "store_admin" | "store_owner",
    storeId: req.body.storeId ? String(req.body.storeId) : null,
  });

  return sendSuccess(res, admin, "Admin created", 201);
};

const listAdmins = async (_req: Request, res: Response) => {
  const admins = await Admin.findAll();
  return sendSuccess(res, admins, "Admins list");
};

const getAdmin = async (req: Request, res: Response) => {
  const admin = await Admin.findByPk(String(req.params.adminId));
  if (!admin) {
    return sendError(res, "Admin not found", 404);
  }
  return sendSuccess(res, admin, "Admin details");
};

const updateAdmin = async (req: Request, res: Response) => {
  const admin = await Admin.findByPk(String(req.params.adminId));
  if (!admin) {
    return sendError(res, "Admin not found", 404);
  }

  const updates: Record<string, unknown> = {};
  if (req.body.email) {
    const email = String(req.body.email).toLowerCase();
    if (!isEmail(email)) {
      return sendError(res, "Invalid email", 400);
    }
    updates.email = email;
  }
  if (req.body.password) {
    updates.password = await hashPassword(String(req.body.password));
  }
  if (req.body.role) {
    const role = String(req.body.role);
    if (!["super_admin", "store_admin", "store_owner"].includes(role)) {
      return sendError(res, "Invalid role", 400);
    }
    updates.role = role as "super_admin" | "store_admin" | "store_owner";
  }
  if (req.body.storeId !== undefined) {
    updates.storeId = req.body.storeId ? String(req.body.storeId) : null;
  }
  if (req.body.isActive !== undefined) {
    updates.isActive = Boolean(req.body.isActive);
  }

  await admin.update(updates);
  return sendSuccess(res, admin, "Admin updated");
};

const deleteAdmin = async (req: Request, res: Response) => {
  const admin = await Admin.findByPk(String(req.params.adminId));
  if (!admin) {
    return sendError(res, "Admin not found", 404);
  }
  await admin.destroy();
  return sendSuccess(res, { id: admin.id }, "Admin deleted");
};

const createStore = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ["name", "subTitle", "description"]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }

  const store = await Store.create({
    name: String(req.body.name),
    subTitle: String(req.body.subTitle),
    description: String(req.body.description),
    logo: req.body.logo ? String(req.body.logo) : null,
    theme: req.body.theme ?? null,
  });

  return sendSuccess(res, store, "Store created", 201);
};

const listStores = async (_req: Request, res: Response) => {
  const stores = await Store.findAll();
  return sendSuccess(res, stores, "Stores list");
};

const getStore = async (req: Request, res: Response) => {
  const store = await Store.findByPk(String(req.params.storeId));
  if (!store) {
    return sendError(res, "Store not found", 404);
  }
  return sendSuccess(res, store, "Store details");
};

const updateStore = async (req: Request, res: Response) => {
  const store = await Store.findByPk(String(req.params.storeId));
  if (!store) {
    return sendError(res, "Store not found", 404);
  }

  const updates: Record<string, unknown> = {};
  if (req.body.name) updates.name = String(req.body.name);
  if (req.body.subTitle) updates.subTitle = String(req.body.subTitle);
  if (req.body.description) updates.description = String(req.body.description);
  if (req.body.logo !== undefined) {
    updates.logo = req.body.logo ? String(req.body.logo) : null;
  }
  if (req.body.theme !== undefined) updates.theme = req.body.theme;

  await store.update(updates);
  return sendSuccess(res, store, "Store updated");
};

const deleteStore = async (req: Request, res: Response) => {
  const store = await Store.findByPk(String(req.params.storeId));
  if (!store) {
    return sendError(res, "Store not found", 404);
  }
  await store.destroy();
  return sendSuccess(res, { id: store.id }, "Store deleted");
};

const assignStoreAdmin = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ["adminId"]);
  if (missing.length) {
    return sendError(res, "adminId is required", 400);
  }

  const store = await Store.findByPk(String(req.params.storeId));
  if (!store) {
    return sendError(res, "Store not found", 404);
  }

  const admin = await Admin.findByPk(String(req.body.adminId));
  if (!admin) {
    return sendError(res, "Admin not found", 404);
  }

  await admin.update({ storeId: store.id });
  return sendSuccess(
    res,
    { adminId: admin.id, storeId: store.id },
    "Store assigned"
  );
};

export {
  assignStoreAdmin,
  createAdmin,
  createStore,
  deleteAdmin,
  deleteStore,
  getAdmin,
  getDashboardAnalytics,
  getStore,
  listAdmins,
  listStores,
  updateAdmin,
  updateStore,
};
