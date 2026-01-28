import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

type JwtPayload = {
  adminId: string;
  role: "super_admin" | "store_admin" | "store_owner";
  storeId: string | null;
};

const signAdminToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
};

export { signAdminToken };
