import express from "express";

import { body } from "express-validator";
import {
  createCard,
  deleteCard,
  reviewCard,
  editCard,
} from "../controllers/cards.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post(
  "/",
  [body("rectoContent").trim().isLength({ min: 3 })],
  isAuth,
  createCard
);

router.post(
  "/:cardId/edit",
  [body("rectoContent").trim().isLength({ min: 3 })],
  isAuth,
  editCard
);

router.post("/:cardId/review", isAuth, reviewCard);

router.delete("/:cardId", isAuth, deleteCard);

export default router;
