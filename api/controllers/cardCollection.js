import mongoose from "mongoose";

import Card from "../models/card.js";
import CardCollection from "../models/cardCollection.js";
import { validationResult } from "express-validator";

const ObjectId = mongoose.Types.ObjectId;

export const getCards = async (req, res, next) => {
  const { collectionId } = req.params;
  const offset = +req.query.offset || 0;
  const limit = +req.query.limit || 10;
  try {
    const totalCards = await Card.count({
      cardCollection: new ObjectId(collectionId),
    });
    const cards = await Card.getCards(
      {
        cardCollection: new ObjectId(collectionId),
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

export const createCard = async (req, res, next) => {
  const { rectoContent, versoContent, title, cardCollectionId } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const statusCode = 422;
      const message = "Something in validation went wrong";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }
    let collection = await CardCollection.findById(cardCollectionId).exec();
    if (!collection) {
      const statusCode = 400;
      const message = "Bad Collection Id";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }
    let card = {
      rectoContent,
      versoContent,
      title,
      cardCollection: cardCollectionId,
    };
    card = new Card(card);
    collection.numCards += 1;
    await Promise.all([card.save(), collection.save()]);
    return res.status(201).json({ card });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req;
  try {
    let card = await Card.getCard({
      _id: new ObjectId(cardId),
    });
    if (!card || card.cardCollection.owner.toString() !== userId.toString()) {
      const statusCode = 400;
      const message = "Bad Collection Id";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }
    card = await Card.deleteCard(cardId);
    return res
      .status(200)
      .json({ message: "The card has been successfully deleted" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

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

export const getCollection = async (req, res, next) => {
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
    return res.status(200).json({ collection });
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
    const collection = await CardCollection.deleteCollection({
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
