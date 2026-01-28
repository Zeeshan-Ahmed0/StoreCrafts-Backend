import type { Request, Response } from "express";
import { Banner } from "../models/index.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { applyStoreScope } from "../utils/storeScope.js";
import { requireFields } from "../utils/validation.js";

const listBanners = async (req: Request, res: Response) => {
  const banners = await Banner.findAll({
    where: applyStoreScope(req.storeId!, {}),
    order: [["position", "ASC"]],
  });
  return sendSuccess(res, banners, "Banners");
};

const listPublicBanners = async (req: Request, res: Response) => {
  const storeId = String(req.params.storeId);
  const banners = await Banner.findAll({
    where: applyStoreScope(storeId, { isActive: true }),
    order: [["position", "ASC"]],
  });
  return sendSuccess(res, banners, "Banners");
};

const createBanner = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ["image"]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }

  const banner = await Banner.create({
    storeId: req.storeId!,
    title: req.body.title ? String(req.body.title) : null,
    image: String(req.body.image),
    link: req.body.link ? String(req.body.link) : null,
    position: req.body.position ? Number(req.body.position) : 0,
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
  });

  return sendSuccess(res, banner, "Banner created", 201);
};

const updateBanner = async (req: Request, res: Response) => {
  const banner = await Banner.findOne({
    where: applyStoreScope(req.storeId!, { id: Number(req.params.bannerId) }),
  });
  if (!banner) {
    return sendError(res, "Banner not found", 404);
  }

  const updates: Record<string, unknown> = {};
  if (req.body.title !== undefined) updates.title = String(req.body.title);
  if (req.body.image !== undefined) updates.image = String(req.body.image);
  if (req.body.link !== undefined) updates.link = String(req.body.link);
  if (req.body.position !== undefined) updates.position = Number(req.body.position);
  if (req.body.isActive !== undefined) updates.isActive = Boolean(req.body.isActive);

  await banner.update(updates);
  return sendSuccess(res, banner, "Banner updated");
};

const deleteBanner = async (req: Request, res: Response) => {
  const banner = await Banner.findOne({
    where: applyStoreScope(req.storeId!, { id: Number(req.params.bannerId) }),
  });
  if (!banner) {
    return sendError(res, "Banner not found", 404);
  }
  await banner.destroy();
  return sendSuccess(res, { id: banner.id }, "Banner deleted");
};

export {
  createBanner,
  deleteBanner,
  listBanners,
  listPublicBanners,
  updateBanner,
};
