import express from "express";

import { createSession } from "../controllers/dailySessions.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/", isAuth, createSession);

export default router;
