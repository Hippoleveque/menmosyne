import mongoose from "mongoose";
const { Schema, model } = mongoose;

const cardReviewSchema = new Schema(
  {
    session: {
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
    input: {
      type: String,
      enum: ["EASY", "OK", "REVIEW"],
      required: true,
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
