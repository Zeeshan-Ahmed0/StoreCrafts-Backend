import fs from "fs";
import path from "path";
import type { Request } from "express";

const uploadRoot = path.resolve("uploads", "tmp");

const ensureUploadDir = () => {
  fs.mkdirSync(uploadRoot, { recursive: true });
};

const storeUploadedFile = (req: Request, field = "file") => {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  if (!file) {
    return null;
  }
  return {
    field,
    filename: file.filename,
    path: file.path,
    mimeType: file.mimetype,
    size: file.size,
  };
};

export { ensureUploadDir, storeUploadedFile, uploadRoot };
