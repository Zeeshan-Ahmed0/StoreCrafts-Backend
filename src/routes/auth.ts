import { Router } from "express";
import {
  adminLogin,
  userLogin,
  userRegister,
} from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/admin/login", adminLogin);
authRouter.post("/user/register", userRegister);
authRouter.post("/user/login", userLogin);

export { authRouter };
