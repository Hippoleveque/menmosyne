import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { isAuth } from "../middlewares/isAuth.js";
import { importFromAnki } from "../controllers/imports.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { userId } = req;
    const fileName = file.originalname.split(".")[0];
    const filePath = `${__dirname}/ankiImports/${userId.toString()}/${fileName}`;
    fs.mkdirSync(filePath, { recursive: true });
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const upload = multer({ storage: fileStorage }).single("file");

const router = express.Router();

router.post("/import", isAuth, upload, importFromAnki);

export default router;
