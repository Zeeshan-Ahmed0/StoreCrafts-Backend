import type { Request, Response } from "express";
import { Policy } from "../models/index.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { applyStoreScope } from "../utils/storeScope.js";

const listPolicies = async (req: Request, res: Response) => {
  const policies = await Policy.findAll({
    where: applyStoreScope(req.storeId!, {}),
    order: [["id", "ASC"]],
  });
  return sendSuccess(res, policies, "Store policies");
};

const listPublicPolicies = async (req: Request, res: Response) => {
  const storeId = String(req.params.storeId);
  const policies = await Policy.findAll({
    where: applyStoreScope(storeId, {}),
    order: [["id", "ASC"]],
  });
  return sendSuccess(res, policies, "Store policies");
};

const createPolicy = async (req: Request, res: Response) => {
  const policy = await Policy.create({
    storeId: req.storeId!,
    privacy: req.body.privacy ? String(req.body.privacy) : null,
    shipping: req.body.shipping ? String(req.body.shipping) : null,
    returnPolicy: req.body.returnPolicy ? String(req.body.returnPolicy) : null,
  });
  return sendSuccess(res, policy, "Policy created", 201);
};

const updatePolicy = async (req: Request, res: Response) => {
  const policy = await Policy.findOne({
    where: applyStoreScope(req.storeId!, { id: Number(req.params.policyId) }),
  });
  if (!policy) {
    return sendError(res, "Policy not found", 404);
  }

  const updates: Record<string, unknown> = {};
  if (req.body.privacy !== undefined) {
    updates.privacy = req.body.privacy ? String(req.body.privacy) : null;
  }
  if (req.body.shipping !== undefined) {
    updates.shipping = req.body.shipping ? String(req.body.shipping) : null;
  }
  if (req.body.returnPolicy !== undefined) {
    updates.returnPolicy = req.body.returnPolicy
      ? String(req.body.returnPolicy)
      : null;
  }

  await policy.update(updates);
  return sendSuccess(res, policy, "Policy updated");
};

const deletePolicy = async (req: Request, res: Response) => {
  const policy = await Policy.findOne({
    where: applyStoreScope(req.storeId!, { id: Number(req.params.policyId) }),
  });
  if (!policy) {
    return sendError(res, "Policy not found", 404);
  }
  await policy.destroy();
  return sendSuccess(res, { id: policy.id }, "Policy deleted");
};

export {
  createPolicy,
  deletePolicy,
  listPolicies,
  listPublicPolicies,
  updatePolicy,
};
