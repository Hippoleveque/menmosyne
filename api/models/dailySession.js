import mongoose from "mongoose";
const { Schema, model } = mongoose;

const dailySessionSchema = new Schema(
  {
    collection: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "CardCollection",
    },
    date: {
      type: Schema.Types.Date,
      required: true,
    },
    reviews: [
        {
          type: Schema.Types.ObjectId,
          ref: "CardReview",
        },
      ],
  },
  { timestamps: true }
);

export default model("DailySession", dailySessionSchema)