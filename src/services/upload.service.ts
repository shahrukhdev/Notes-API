import multer from "multer";
import path from "path";
import fs from "fs";
import AppError from "../utils/AppError.js";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  MAX_FILE_COUNT,
} from "../constants/attachment.constants.js";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  filename: (req, file, cb) => {
    // safer unique filename (avoids spaces + collisions)
    const safeName = file.originalname.replace(/\s+/g, "-");
    const uniqueName = `${Date.now()}-${safeName}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid file type: ${file.originalname} (${file.mimetype})`,
        422
      ) as any
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILE_COUNT,
  },
});