import mongoose from "mongoose";
const { Schema, model } = mongoose;

const cardSchema = new Schema(
  {
    cardCollection: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "CardCollection",
    },
    rectoContent: {
      type: String,
      required: true,
    },
    versoContent: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    priority: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  { timestamps: true }
);

export default model("Card", cardSchema);
