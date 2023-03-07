import express from "express";

import { body } from "express-validator";
import {
  getCards,
  createCard,
  getCollections,
  createCollection,
  getCollection,
  deleteCollection,
  deleteCard,
} from "../controllers/cardCollection.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/cards/:collectionId", isAuth, getCards);
router.get("/cardCollections", isAuth, getCollections);
router.get("/cardCollection/:collectionId", isAuth, getCollection);

router.post(
  "/cards",
  [body("title").trim().isLength({ min: 3 })],
  isAuth,
  createCard
);

router.post(
  "/cardCollections",
  [body("name").trim().isLength({ min: 3 })],
  isAuth,
  createCollection
);

router.delete("/cardCollections/:collectionId", isAuth, deleteCollection);
router.delete("/cards/:cardId", isAuth, deleteCard);

export default router;
