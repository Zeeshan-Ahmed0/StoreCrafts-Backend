import type { Request, Response } from "express";
import { NavbarOption } from "../models/index.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { applyStoreScope } from "../utils/storeScope.js";
import { requireFields } from "../utils/validation.js";

const listNavbarOptions = async (req: Request, res: Response) => {
  const options = await NavbarOption.findAll({
    where: applyStoreScope(req.storeId!, {}),
    order: [["position", "ASC"]],
  });
  return sendSuccess(res, options, "Navbar options");
};

const listPublicNavbarOptions = async (req: Request, res: Response) => {
  const storeId = String(req.params.storeId);
  const options = await NavbarOption.findAll({
    where: applyStoreScope(storeId, { isActive: true }),
    order: [["position", "ASC"]],
  });
  return sendSuccess(res, options, "Navbar options");
};

const createNavbarOption = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ["label", "url"]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }

  const option = await NavbarOption.create({
    storeId: req.storeId!,
    label: String(req.body.label),
    url: String(req.body.url),
    type: req.body.type ? String(req.body.type) : "link",
    position: req.body.position ? Number(req.body.position) : 0,
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
  });

  return sendSuccess(res, option, "Navbar option created", 201);
};

const updateNavbarOption = async (req: Request, res: Response) => {
  const option = await NavbarOption.findOne({
    where: applyStoreScope(req.storeId!, { id: Number(req.params.optionId) }),
  });
  if (!option) {
    return sendError(res, "Navbar option not found", 404);
  }

  const updates: Record<string, unknown> = {};
  if (req.body.label !== undefined) updates.label = String(req.body.label);
  if (req.body.url !== undefined) updates.url = String(req.body.url);
  if (req.body.type !== undefined) updates.type = String(req.body.type);
  if (req.body.position !== undefined) updates.position = Number(req.body.position);
  if (req.body.isActive !== undefined) updates.isActive = Boolean(req.body.isActive);

  await option.update(updates);
  return sendSuccess(res, option, "Navbar option updated");
};

const deleteNavbarOption = async (req: Request, res: Response) => {
  const option = await NavbarOption.findOne({
    where: applyStoreScope(req.storeId!, { id: Number(req.params.optionId) }),
  });
  if (!option) {
    return sendError(res, "Navbar option not found", 404);
  }
  await option.destroy();
  return sendSuccess(res, { id: option.id }, "Navbar option deleted");
};

const reorderNavbarOptions = async (req: Request, res: Response) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  if (!items.length) {
    return sendError(res, "items is required", 400);
  }

  await Promise.all(
    items.map((item: Record<string, unknown>) =>
      NavbarOption.update(
        { position: Number(item.position ?? 0) },
        {
          where: applyStoreScope(req.storeId!, { id: Number(item.id) }),
        }
      )
    )
  );

  return sendSuccess(res, { count: items.length }, "Navbar reordered");
};

export {
  createNavbarOption,
  deleteNavbarOption,
  listNavbarOptions,
  listPublicNavbarOptions,
  reorderNavbarOptions,
  updateNavbarOption,
};
