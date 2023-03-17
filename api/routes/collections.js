import express from "express";

import { body } from "express-validator";
import {
  getCollections,
  createCollection,
  getCollection,
  deleteCollection,
  getCollectionCards,
} from "../controllers/collections.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/", isAuth, getCollections);
router.get("/:collectionId", isAuth, getCollection);
router.get("/:collectionId/cards", isAuth, getCollectionCards);
router.post(
  "/",
  [body("name").trim().isLength({ min: 3 })],
  isAuth,
  createCollection
);
router.delete("/:collectionId", isAuth, deleteCollection);

export default router;
