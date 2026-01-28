import { Router } from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { authenticateJwt, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const uploadRouter = Router();

uploadRouter.post(
  "/image",
  authenticateJwt,
  requireRole("super_admin", "store_admin"),
  upload.single("image"),
  uploadImage
);

export { uploadRouter };
