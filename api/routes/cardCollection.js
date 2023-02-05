import express from "express";

import { body } from "express-validator";
import {
  getCards,
  createCard,
  getCollections,
  createCollection,
  getCollection,
  deleteCollection,
} from "../controllers/cardCollection.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/cards/:collectionId", isAuth, getCards);
router.get("/cardCollections", isAuth, getCollections);
router.get("/collections/:collectionId", isAuth, getCollection);

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

export default router;
