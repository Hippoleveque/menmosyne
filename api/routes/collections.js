import express from "express";

import { body } from "express-validator";
import {
  getCollections,
  createCollection,
  getCollection,
  deleteCollection,
  getCollectionCards,
  getCollectionCardsToReview,
  editCollection,
} from "../controllers/collections.js";
import { isAuth } from "../middlewares/isAuth.js";

const checkCorrectPolicy = (value) => {
  return typeof value === "number" && value >= 0;
};

const router = express.Router();

router.get("/", isAuth, getCollections);
router.get("/:collectionId", isAuth, getCollection);
router.get("/:collectionId/cards", isAuth, getCollectionCards);
router.get(
  "/:collectionId/cards-to-review",
  isAuth,
  getCollectionCardsToReview
);
router.post(
  "/",
  [body("name").trim().isLength({ min: 3 })],
  isAuth,
  createCollection
);
router.post(
  "/:collectionId",
  [
    body("name").trim().isLength({ min: 3 }),
    body("newCardsPolicy").custom(checkCorrectPolicy),
    body("reviewCardsPolicy").custom(checkCorrectPolicy),
  ],
  isAuth,
  editCollection
);
router.delete("/:collectionId", isAuth, deleteCollection);

export default router;
