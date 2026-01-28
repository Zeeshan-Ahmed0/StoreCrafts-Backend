import { Router } from "express";
import {
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
} from "../controllers/adminController.js";
import { authenticateJwt, requireRole } from "../middleware/auth.js";

const adminRouter = Router();

adminRouter.use(authenticateJwt, requireRole("super_admin"));

adminRouter.get("/dashboard", getDashboardAnalytics);

adminRouter.post("/admins", createAdmin);
adminRouter.get("/admins", listAdmins);
adminRouter.get("/admins/:adminId", getAdmin);
adminRouter.put("/admins/:adminId", updateAdmin);
adminRouter.delete("/admins/:adminId", deleteAdmin);

adminRouter.post("/stores", createStore);
adminRouter.get("/stores", listStores);
adminRouter.get("/stores/:storeId", getStore);
adminRouter.put("/stores/:storeId", updateStore);
adminRouter.delete("/stores/:storeId", deleteStore);

adminRouter.post("/stores/:storeId/assign-admin", assignStoreAdmin);

export { adminRouter };
