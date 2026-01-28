import { Router } from "express";
import {
  createPolicy,
  deletePolicy,
  listPolicies,
  listPublicPolicies,
  updatePolicy,
} from "../controllers/policyController.js";
import { authenticateJwt, requireRole, requireStoreScope } from "../middleware/auth.js";

const policyRouter = Router();

policyRouter.get("/public/:storeId", listPublicPolicies);

policyRouter.get(
  "/",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  listPolicies
);
policyRouter.post(
  "/",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  createPolicy
);
policyRouter.put(
  "/:policyId",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  updatePolicy
);
policyRouter.delete(
  "/:policyId",
  authenticateJwt,
  requireRole("store_admin", "store_owner"),
  requireStoreScope,
  deletePolicy
);

export { policyRouter };
