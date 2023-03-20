import mongoose from "mongoose";
const { Schema, model } = mongoose;

const dailySessionSchema = new Schema(
  {
    cardCollection: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "CardCollection",
    },
    date: {
      type: Schema.Types.Date,
      required: true,
    },
    numReviews: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model("DailySession", dailySessionSchema);
