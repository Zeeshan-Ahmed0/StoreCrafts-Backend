import type { Request, Response } from "express";
import { Op } from "sequelize";
import { Coupon } from "../models/index.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { applyStoreScope } from "../utils/storeScope.js";
import { requireFields } from "../utils/validation.js";

const listCoupons = async (req: Request, res: Response) => {
  const { active, expired, sort } = req.query;
  const where: Record<string | symbol, unknown> = applyStoreScope(
    req.storeId!,
    {}
  ) as Record<string | symbol, unknown>;

  const now = new Date();
  if (active !== undefined && String(active).toLowerCase() === "true") {
    where.isActive = true;
    where[Op.or] = [
      { startsAt: null },
      { startsAt: { [Op.lte]: now } },
    ];
    where[Op.and] = [
      { endsAt: null },
      { endsAt: { [Op.gte]: now } },
    ];
  }
  if (expired !== undefined && String(expired).toLowerCase() === "true") {
    where.endsAt = { [Op.lt]: now };
  }

  const orderBy: Array<[string, "ASC" | "DESC"]> =
    sort === "discount" ? [["value", "DESC"]] : [["id", "DESC"]];

  const coupons = await Coupon.findAll({ where, order: orderBy });
  return sendSuccess(res, coupons, "Coupons");
};

const listPublicCoupons = async (req: Request, res: Response) => {
  const storeId = String(req.params.storeId);
  const where: Record<string | symbol, unknown> = applyStoreScope(storeId, {
    isActive: true,
  }) as Record<string | symbol, unknown>;

  const now = new Date();
  where[Op.or] = [{ startsAt: null }, { startsAt: { [Op.lte]: now } }];
  where[Op.and] = [{ endsAt: null }, { endsAt: { [Op.gte]: now } }];

  const coupons = await Coupon.findAll({ where, order: [["id", "DESC"]] });
  return sendSuccess(res, coupons, "Coupons");
};

const createCoupon = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ["code", "value"]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }

  const coupon = await Coupon.create({
    storeId: req.storeId!,
    code: String(req.body.code).toUpperCase(),
    isPercentage:
      req.body.isPercentage !== undefined ? Boolean(req.body.isPercentage) : true,
    value: Number(req.body.value),
    startsAt: req.body.startsAt ? new Date(req.body.startsAt) : null,
    endsAt: req.body.endsAt ? new Date(req.body.endsAt) : null,
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
  });

  return sendSuccess(res, coupon, "Coupon created", 201);
};

const updateCoupon = async (req: Request, res: Response) => {
  const coupon = await Coupon.findOne({
    where: applyStoreScope(req.storeId!, { id: Number(req.params.couponId) }),
  });
  if (!coupon) {
    return sendError(res, "Coupon not found", 404);
  }

  const updates: Record<string, unknown> = {};
  if (req.body.code !== undefined) updates.code = String(req.body.code).toUpperCase();
  if (req.body.isPercentage !== undefined) {
    updates.isPercentage = Boolean(req.body.isPercentage);
  }
  if (req.body.value !== undefined) {
    updates.value = Number(req.body.value);
  }
  if (req.body.startsAt !== undefined) {
    updates.startsAt = req.body.startsAt ? new Date(req.body.startsAt) : null;
  }
  if (req.body.endsAt !== undefined) {
    updates.endsAt = req.body.endsAt ? new Date(req.body.endsAt) : null;
  }
  if (req.body.isActive !== undefined) updates.isActive = Boolean(req.body.isActive);

  await coupon.update(updates);
  return sendSuccess(res, coupon, "Coupon updated");
};

const deleteCoupon = async (req: Request, res: Response) => {
  const coupon = await Coupon.findOne({
    where: applyStoreScope(req.storeId!, { id: Number(req.params.couponId) }),
  });
  if (!coupon) {
    return sendError(res, "Coupon not found", 404);
  }
  await coupon.destroy();
  return sendSuccess(res, { id: coupon.id }, "Coupon deleted");
};

const validateCoupon = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ["code"]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }

  const storeId = String(req.params.storeId);
  const code = String(req.body.code).toUpperCase();

  const now = new Date();
  const coupon = await Coupon.findOne({
    where: {
      storeId,
      code,
      isActive: true,
      [Op.or]: [{ startsAt: null }, { startsAt: { [Op.lte]: now } }],
      [Op.and]: [{ endsAt: null }, { endsAt: { [Op.gte]: now } }],
    },
  });

  if (!coupon) {
    return sendError(res, "Invalid coupon", 404);
  }

  return sendSuccess(res, coupon, "Coupon valid");
};

export {
  createCoupon,
  deleteCoupon,
  listCoupons,
  listPublicCoupons,
  updateCoupon,
  validateCoupon,
};
