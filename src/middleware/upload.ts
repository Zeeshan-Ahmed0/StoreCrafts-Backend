import multer from "multer";
import path from "path";
import crypto from "crypto";
import { ensureUploadDir, uploadRoot } from "../helpers/upload.js";

ensureUploadDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadRoot);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = crypto.randomBytes(16).toString("hex");
    cb(null, `${name}${ext}`);
  },
});

const upload = multer({ storage });

export { upload };
