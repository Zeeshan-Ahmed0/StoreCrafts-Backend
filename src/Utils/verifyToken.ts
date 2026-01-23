import jwt from "jsonwebtoken";
import { sendError } from "./helpers.ts";

export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return sendError(res, "Access Denied", 403);
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY || "JWT_SECRET_KEY",
    (error: any, decoded: any) => {
      if (error) {
        return sendError(res, "Invalid Token", 401);
      }
      req.user = decoded;
      next();
    }
  );
};
