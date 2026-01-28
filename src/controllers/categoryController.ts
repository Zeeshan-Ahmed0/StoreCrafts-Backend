import type { Request, Response } from "express";
import { Category } from "../models/index.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { applyStoreScope } from "../utils/storeScope.js";
import { requireFields } from "../utils/validation.js";

const listCategories = async (req: Request, res: Response) => {
  const storeId = req.storeId ?? String(req.query.storeId ?? "");
  if (!storeId) {
    return sendError(res, "storeId is required", 400);
  }

  const categories = await Category.findAll({
    where: applyStoreScope(storeId, {}),
    order: [["id", "ASC"]],
  });
  return sendSuccess(res, categories, "Categories");
};

const createCategory = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ["name", "image"]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }

  const category = await Category.create({
    storeId: req.storeId!,
    name: String(req.body.name),
    image: String(req.body.image),
    subtitle: req.body.subtitle ? String(req.body.subtitle) : null,
    description: req.body.description ? String(req.body.description) : null,
  });

  return sendSuccess(res, category, "Category created", 201);
};

export { createCategory, listCategories };
