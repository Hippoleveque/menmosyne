import mongoose from "mongoose";
import { validationResult } from "express-validator";

import Card from "../models/card.js";
import CardCollection from "../models/cardCollection.js";
import DailySession from "../models/dailySession.js";
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
    await Promise.all([
      card.save(),
      CardCollection.updateOne(
        { _id: collection._id },
        { $inc: { numCards: 1 } }
      ),
    ]);
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
    await Promise.all([
      Card.findByIdAndDelete(cardId).exec(),
      CardCollection.updateOne(
        { _id: card.cardCollection._id },
        { $inc: { numCards: -1 } }
      ),
    ]);
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
  const { cardId } = req.params;
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
    const now = new Date();
    let dailySession;
    const foundSession = await DailySession.find({
      date: {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      },
      cardCollection: card.cardCollection._id,
    })
      .sort({ date: -1 })
      .limit(1);
    if (foundSession.length) dailySession = foundSession[0];
    else {
      const currentDate = new Date();
      const collection = await CardCollection.getCollection({
        _id: card.cardCollection._id,
      });
      collection.lastReviewed = currentDate;
      dailySession = {
        cardCollection: collection._id.toString(),
        date: currentDate,
      };
      dailySession = new DailySession(dailySession);
      await Promise.all([dailySession.save(), collection.save()]);
    }
    // Update the priority and create a review only if ansQuality is 5
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
        dailySession: dailySession._id,
        date: new Date(),
        oldPriority,
        newPriority: card.priority,
      });
      if (inputs) {
        cardReview.inputs = inputs;
      }
      // It means that the card is new
      if (card.numberReviewed === 1) {
        await Promise.all([
          DailySession.updateOne(
            { _id: dailySession._id },
            { $inc: { "numReviews.newCards": 1 } }
          ),
          cardReview.save(),
        ]);
      } else {
        await Promise.all([
          DailySession.updateOne(
            { _id: dailySession._id },
            { $inc: { "numReviews.reviewCards": 1 } }
          ),
          cardReview.save(),
        ]);
      }
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
