import mongoose from "mongoose";
const { Schema, model } = mongoose;

const cardReviewSchema = new Schema(
  {
    dailySession: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "DailySession",
    },
    card: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Card",
    },
    date: {
      type: Schema.Types.Date,
      required: true,
    },
    inputs: {
      medium: Number,
      hard: Number,
    },
    oldPriority: {
      type: Number,
      required: false,
    },
    newPriority: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

export default model("CardReview", cardReviewSchema);
