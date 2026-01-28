import type { Request, Response } from "express";
import { Admin, User } from "../models/index.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { isEmail, requireFields } from "../utils/validation.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signAdminToken } from "../utils/jwt.js";

const adminLogin = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ["email", "password"]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }
  const email = String(req.body.email).toLowerCase();
  const password = String(req.body.password);
  if (!isEmail(email)) {
    return sendError(res, "Invalid email", 400);
  }

  const admin = await Admin.findOne({ where: { email } });
  if (!admin || !admin.isActive) {
    return sendError(res, "Invalid credentials", 401);
  }
  const isValid = await verifyPassword(password, admin.password);
  if (!isValid) {
    return sendError(res, "Invalid credentials", 401);
  }

  const token = signAdminToken({
    adminId: admin.id,
    role: admin.role,
    storeId: admin.storeId,
  });

  return sendSuccess(
    res,
    { token, role: admin.role, storeId: admin.storeId },
    "Authenticated"
  );
};

const userRegister = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, [
    "storeId",
    "email",
    "name",
    "password",
  ]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }
  const email = String(req.body.email).toLowerCase();
  if (!isEmail(email)) {
    return sendError(res, "Invalid email", 400);
  }

  const passwordHash = await hashPassword(String(req.body.password));
  const user = await User.create({
    storeId: String(req.body.storeId),
    email,
    name: String(req.body.name),
    phone: req.body.phone ? String(req.body.phone) : null,
    password: passwordHash,
  });

  return sendSuccess(res, { id: user.id }, "Registered", 201);
};

const userLogin = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ["storeId", "email", "password"]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }
  const email = String(req.body.email).toLowerCase();
  if (!isEmail(email)) {
    return sendError(res, "Invalid email", 400);
  }

  const user = await User.findOne({
    where: { storeId: String(req.body.storeId), email },
  });
  if (!user || !user.isActive || !user.password) {
    return sendError(res, "Invalid credentials", 401);
  }
  const isValid = await verifyPassword(String(req.body.password), user.password);
  if (!isValid) {
    return sendError(res, "Invalid credentials", 401);
  }

  return sendSuccess(
    res,
    { id: user.id, storeId: user.storeId },
    "Authenticated"
  );
};

export { adminLogin, userLogin, userRegister };
