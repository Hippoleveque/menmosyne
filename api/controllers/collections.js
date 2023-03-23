import mongoose from "mongoose";

import Card from "../models/card.js";
import CardCollection from "../models/cardCollection.js";
import { validationResult } from "express-validator";

const ObjectId = mongoose.Types.ObjectId;

export const getCollections = async (req, res, next) => {
  const offset = +req.query.offset || 0;
  const limit = +req.query.limit || 10;
  const { userId } = req;
  try {
    const totalCollections = await CardCollection.countDocs({
      owner: new ObjectId(userId),
    });
    const cardCollections = await CardCollection.getCollections(
      {
        owner: new ObjectId(userId),
      },
      offset,
      limit
    );
    return res.status(200).json({ cardCollections, totalCollections });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getCollectionCards = async (req, res, next) => {
  const { collectionId } = req.params;
  const { userId } = req;
  const offset = +req.query.offset || 0;
  const limit = +req.query.limit || 10;
  try {
    const totalCards = await Card.count({
      cardCollection: new ObjectId(collectionId),
      user: { _id: new ObjectId(userId) },
    });
    const cards = await Card.getCards(
      {
        cardCollection: {
          _id: new ObjectId(collectionId),
          user: { _id: new ObjectId(userId) },
        },
      },
      offset,
      limit
    );
    return res.status(200).json({ cards: cards, totalCards: totalCards });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getCollectionCardsToReview = async (req, res, next) => {
  const { collectionId } = req.params;
  const { userId } = req;
  const offset = +req.query.offset || 0;
  const limit = +req.query.limit || 10;
  try {
    const cardCollection = await CardCollection.getCollection({
      _id: collectionId,
      owner: userId,
    });
    const { reviewCardsPerDay, newCardsPerDay } = cardCollection.reviewPolicy;
    const totalNewCards = await Card.count({
      cardCollection: new ObjectId(collectionId),
      user: { _id: new ObjectId(userId) },
      lastReviewed: { $exists: false },
    });
    const totalCardsToReview = await Card.count({
      cardCollection: new ObjectId(collectionId),
      user: { _id: new ObjectId(userId) },
      lastReviewed: { $exists: true },
    });
    const totalCards =
      Math.min(newCardsPerDay, totalNewCards) +
      Math.min(reviewCardsPerDay, totalCardsToReview);
    // Get the cards not yet reviewed
    let ansCards = [];
    if (offset + limit < newCardsPerDay) {
      ansCards = await Card.getCards(
        {
          cardCollection: {
            _id: new ObjectId(collectionId),
            user: { _id: new ObjectId(userId) },
          },
          lastReviewed: { $exists: false },
        },
        offset,
        limit
      );
    }
    // We query a mix of cards never reviewed and cards already reviewed
    else if (offset < newCardsPerDay) {
      const newCards = await Card.getCards(
        {
          cardCollection: {
            _id: new ObjectId(collectionId),
            user: { _id: new ObjectId(userId) },
          },
          lastReviewed: { $exists: false },
        },
        offset,
        totalNewCards - offset
      );
      const cardsToReview = await Card.find({
        cardCollection: {
          _id: new ObjectId(collectionId),
          user: { _id: new ObjectId(userId) },
        },
        lastReviewed: { $exists: true },
      })
        .limit(limit - (totalNewCards - offset))
        .sort({ priority: 1 })
        .exec();
      ansCards = [...newCards, ...cardsToReview];
    }
    // We adjust the offset and query only cards already reviewed
    else {
      const trueOffset = offset - totalNewCards;
      ansCards = await Card.find({
        cardCollection: {
          _id: new ObjectId(collectionId),
          user: { _id: new ObjectId(userId) },
        },
        lastReviewed: { $exists: true },
      })
        .skip(trueOffset)
        .limit(limit)
        .sort({ priority: 1 })
        .exec();
    }
    return res.status(200).json({ cards: ansCards, totalCards: totalCards });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getCollection = async (req, res, next) => {
  const { collectionId } = req.params;
  const { userId } = req;
  try {
    const cardCollection = await CardCollection.getCollection({
      _id: collectionId,
      owner: userId,
    });
    if (!cardCollection) {
      const statusCode = 400;
      const message = "Bad Collection Id";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }
    return res.status(200).json({ cardCollection });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const createCollection = async (req, res, next) => {
  const { name, description } = req.body;
  const { userId } = req;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const statusCode = 422;
      const message = "Something in validation went wrong";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }
    let cardCollection = {
      owner: userId,
      name: name,
      description: description,
    };
    cardCollection = new CardCollection(cardCollection);
    await cardCollection.save();
    return res.status(201).json({ cardCollection });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteCollection = async (req, res, next) => {
  const { collectionId } = req.params;
  const { userId } = req;
  try {
    const collection = await CardCollection.getCollection({
      _id: collectionId,
      owner: userId,
    });
    if (!collection) {
      const statusCode = 400;
      const message = "Bad Collection Id";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }
    await Promise.all([
      CardCollection.deleteCollection(collectionId),
      Card.deleteCards({ cardCollection: collectionId }),
    ]);
    return res
      .status(200)
      .json({ message: "Collection deleted and associated cards deleted" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
