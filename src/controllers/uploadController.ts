import type { Request, Response } from "express";
import { storeUploadedFile } from "../helpers/upload.js";
import { sendError, sendSuccess } from "../utils/response.js";

const uploadImage = (req: Request, res: Response) => {
  const file = storeUploadedFile(req, "image");
  if (!file) {
    return sendError(res, "Image is required", 400);
  }
  return sendSuccess(res, file, "Uploaded");
};

export { uploadImage };
