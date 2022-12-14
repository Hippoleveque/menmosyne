import Card from "../models/card.js";
import CardCollection from "../models/cardCollection.js";
import { validationResult } from "express-validator";

const ITEMS_PER_PAGE = 2;

export const getCards = async (req, res, next) => {
  const page = +req.query.page || 1;
  const { cardCollectionId } = req.body;
  try {
    const totalCards = await Card.find({
      cardCollection: cardCollectionId,
    }).countDocuments();
    const cards = await Card.find({
      cardCollection: cardCollectionId,
    })
      .populate("cardCollection")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .exec();
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

export const getCollections = async (req, res, next) => {
  const page = +req.query.page || 1;
  const { userId } = req;
  try {
    const totalCollections = await CardCollection.find({
      owner: userId,
    }).countDocuments();
    const cardCollections = await CardCollection.find({
      owner: userId,
    })
      .populate("owner")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .exec();
    return res.status(200).json({ cardCollections, totalCollections });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const createCollection = async (req, res, next) => {
  const { name } = req.body;
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
