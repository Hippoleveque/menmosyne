import mongoose from "mongoose";

import DailySession from "../models/dailySession.js";
import CardCollection from "../models/cardCollection.js";

const ObjectId = mongoose.Types.ObjectId;

export const createSession = async (req, res, next) => {
  const { cardCollectionId } = req.body;
  const { userId } = req;
  try {
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
    const currentDate = new Date();
    collection.lastReviewed = currentDate;
    let dailySession = {
      cardCollection: cardCollectionId,
      date: currentDate,
    };
    dailySession = new DailySession(dailySession);
    await Promise.all([dailySession.save(), collection.save()]);
    return res.status(201).json({ dailySession });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
