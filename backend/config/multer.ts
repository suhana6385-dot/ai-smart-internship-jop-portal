import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const makeStorage = (subfolder: "resumes" | "profile" | "company") => {
  const dest = path.join(__dirname, "..", "uploads", subfolder);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`;
      cb(null, uniqueName);
    },
  });
};

const fileFilter =
  (allowed: string[]) =>
  (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} not allowed. Allowed: ${allowed.join(", ")}`));
    }
  };

const maxSize = (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;

export const uploadResume = multer({
  storage: makeStorage("resumes"),
  fileFilter: fileFilter([".pdf", ".doc", ".docx"]),
  limits: { fileSize: maxSize },
});

export const uploadProfileImage = multer({
  storage: makeStorage("profile"),
  fileFilter: fileFilter([".jpg", ".jpeg", ".png", ".webp"]),
  limits: { fileSize: maxSize },
});

export const uploadCompanyLogo = multer({
  storage: makeStorage("company"),
  fileFilter: fileFilter([".jpg", ".jpeg", ".png", ".webp"]),
  limits: { fileSize: maxSize },
});
