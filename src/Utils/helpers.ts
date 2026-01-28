import type { Response } from "express";

const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  status = 200
) => {
  return res.status(status).json({ success: true, message, data });
};

const sendError = (res: Response, error: unknown, status = 500) => {
  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
      ? error.message
      : "Internal Server Error";
  return res.status(status).json({ success: false, message, status });
};

export { sendSuccess, sendError };
