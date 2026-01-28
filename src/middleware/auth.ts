import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

type JwtPayload = {
  adminId: string;
  role: "super_admin" | "store_admin" | "store_owner";
  storeId: string | null;
};

const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.auth = {
      adminId: payload.adminId,
      role: payload.role,
      storeId: payload.storeId ?? null,
    };
    req.storeId = payload.storeId ?? undefined;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const requireRole =
  (...roles: Array<JwtPayload["role"]>) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    return next();
  };

const requireStoreScope = (req: Request, res: Response, next: NextFunction) => {
  if (!req.storeId && req.auth?.role !== "super_admin") {
    return res
      .status(400)
      .json({ success: false, message: "Store scope is required." });
  }
  return next();
};

export { authenticateJwt, requireRole, requireStoreScope };
