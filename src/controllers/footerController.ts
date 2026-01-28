import type { Request, Response } from "express";
import { Footer } from "../models/index.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { applyStoreScope } from "../utils/storeScope.js";
import { requireFields } from "../utils/validation.js";

const listFooters = async (req: Request, res: Response) => {
  const footers = await Footer.findAll({
    where: applyStoreScope(req.storeId!, {}),
    order: [["id", "ASC"]],
  });
  return sendSuccess(res, footers, "Footers");
};

const listPublicFooters = async (req: Request, res: Response) => {
  const storeId = String(req.params.storeId);
  const footers = await Footer.findAll({
    where: applyStoreScope(storeId, {}),
    order: [["id", "ASC"]],
  });
  return sendSuccess(res, footers, "Footers");
};

const createFooter = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ["label", "url"]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }

  const footer = await Footer.create({
    storeId: req.storeId!,
    label: String(req.body.label),
    url: String(req.body.url),
  });

  return sendSuccess(res, footer, "Footer created", 201);
};

const updateFooter = async (req: Request, res: Response) => {
  const footer = await Footer.findOne({
    where: applyStoreScope(req.storeId!, { id: Number(req.params.footerId) }),
  });
  if (!footer) {
    return sendError(res, "Footer not found", 404);
  }

  const updates: Record<string, unknown> = {};
  if (req.body.label !== undefined) updates.label = String(req.body.label);
  if (req.body.url !== undefined) updates.url = String(req.body.url);

  await footer.update(updates);
  return sendSuccess(res, footer, "Footer updated");
};

const deleteFooter = async (req: Request, res: Response) => {
  const footer = await Footer.findOne({
    where: applyStoreScope(req.storeId!, { id: Number(req.params.footerId) }),
  });
  if (!footer) {
    return sendError(res, "Footer not found", 404);
  }
  await footer.destroy();
  return sendSuccess(res, { id: footer.id }, "Footer deleted");
};

export {
  createFooter,
  deleteFooter,
  listFooters,
  listPublicFooters,
  updateFooter,
};
