import mongoose from "mongoose";

import Card from "../models/card.js";
import CardCollection from "../models/cardCollection.js";
import DailySession from "../models/dailySession.js";
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
  try {
    const now = new Date();
    const foundSession = await DailySession.find({
      date: {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      },
      cardCollection: new ObjectId(collectionId),
    })
      .sort({ date: -1 })
      .limit(1);
    const cardCollection = await CardCollection.getCollection({
      _id: collectionId,
      owner: userId,
    });
    const { reviewCardsPerDay, newCardsPerDay } = cardCollection.reviewPolicy;
    let numNewCards = newCardsPerDay;
    let numReviewCards = reviewCardsPerDay;
    if (foundSession.length) {
      // The user has already reviewed the cards
      const session = foundSession[0];
      if (
        session.numReviews.newCards >= newCardsPerDay &&
        session.numReviews.reviewCards >= reviewCardsPerDay
      ) {
        numNewCards = newCardsPerDay;
        numReviewCards = reviewCardsPerDay;
      } else {
        numNewCards = newCardsPerDay - session.numReviews.newCards;
        numReviewCards = reviewCardsPerDay - session.numReviews.reviewCards;
      }
    }

    let newCards = [];
    if (numNewCards > 0) {
      newCards = await Card.getCards(
        {
          cardCollection: {
            _id: new ObjectId(collectionId),
            user: { _id: new ObjectId(userId) },
          },
          lastReviewed: { $exists: false },
        },
        0,
        numNewCards
      );
    }
    let cardsToReview = [];
    if (numReviewCards > 0) {
      cardsToReview = await Card.find({
        cardCollection: {
          _id: new ObjectId(collectionId),
          user: { _id: new ObjectId(userId) },
        },
        lastReviewed: { $exists: true },
      })
        .limit(numReviewCards)
        .sort({ priority: 1 })
        .exec();
    }
    const ansCards = [...newCards, ...cardsToReview];
    return res.status(200).json({ cards: ansCards });
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

export const editCollection = async (req, res, next) => {
  const { collectionId } = req.params;
  const { name, newCardsPolicy, reviewCardsPolicy } = req.body;
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
    collection.name = name;
    collection.reviewPolicy.newCardsPerDay = parseFloat(newCardsPolicy);
    collection.reviewPolicy.reviewCardsPerDay = parseFloat(reviewCardsPolicy);
    await collection.save();
    return res.status(201).json({ collection });
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
