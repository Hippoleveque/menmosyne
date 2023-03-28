import mongoose from "mongoose";
import { validationResult } from "express-validator";

import Card from "../models/card.js";
import CardCollection from "../models/cardCollection.js";
import CardReview from "../models/cardReview.js";

const ObjectId = mongoose.Types.ObjectId;

export const createCard = async (req, res, next) => {
  const { rectoContent, versoContent, cardCollectionId } = req.body;
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
    let collection = await CardCollection.getCollection({
      _id: new ObjectId(cardCollectionId),
      owner: { _id: new ObjectId(userId) },
    });
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

    if (!card || card.cardCollection.owner._id.toString() !== userId) {
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

export const reviewCard = async (req, res, next) => {
  const { cardId, dailySessionId } = req.params;
  const { ansQuality, inputs } = req.body;
  const { userId } = req;
  try {
    let card = await Card.getCard({
      _id: new ObjectId(cardId),
    });

    if (!card || card.cardCollection.owner._id.toString() !== userId) {
      const statusCode = 400;
      const message = "Bad Collection Id";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }
    // Update the priority and create a review itme only if ansQuality is 5
    const { easinessFactor, priority, numberReviewed } = card;
    if (ansQuality === 5) {
      const oldPriority = card.priority;
      switch (numberReviewed) {
        case 0:
          card.priority = 1;
          break;
        case 1:
          card.priority = 6;
          break;
        default:
          card.priority = priority * easinessFactor;
          break;
      }
      card.lastReviewed = new Date();
      card.numberReviewed += 1;
      const cardReview = new CardReview({
        card: cardId,
        dailySession: new ObjectId(dailySessionId),
        date: new Date(),
        oldPriority,
        newPriority: card.priority,
      });
      if (inputs) {
        cardReview.inputs = inputs;
      }
      await cardReview.save();
    }
    // update easiness factor
    card.easinessFactor =
      easinessFactor +
      (0.1 - (5 - ansQuality) * (0.08 + (5 - ansQuality) * 0.02));
    await card.save();
    return res
      .status(200)
      .json({ message: "The card has been successfully updated" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const editCard = async (req, res, next) => {
  const { cardId } = req.params;
  const { rectoContent, versoContent } = req.body;
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
    let card = await Card.getCard({
      _id: new ObjectId(cardId),
    });
    if (!card || card.cardCollection.owner._id.toString() !== userId) {
      const statusCode = 400;
      const message = "Bad Collection Id";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }
    card.rectoContent = rectoContent;
    card.versoContent = versoContent;
    delete card.lastReviewed;
    card.numberReviewed = 0;
    card.easinessFactor = 2.5;
    card.priority = 1;
    await card.save();
    return res.status(200).json({ card });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
