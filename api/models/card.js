import mongoose from "mongoose";
const { Schema, model } = mongoose;

const cardSchema = new Schema(
  {
    collection: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Collection",
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
