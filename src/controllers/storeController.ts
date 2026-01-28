import type { Request, Response } from "express";
import { sendSuccess } from "../utils/response.js";

const getStoreOverview = (_req: Request, res: Response) => {
  return sendSuccess(res, { message: "Store overview" }, "Store overview");
};

export { getStoreOverview };
