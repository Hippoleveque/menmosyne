import express from "express";

import { body } from "express-validator";
import {
  createCard,
  deleteCard,
} from "../controllers/cards.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post(
  "/",
  [body("title").trim().isLength({ min: 3 })],
  isAuth,
  createCard
);

router.delete("/:cardId", isAuth, deleteCard);

export default router;
