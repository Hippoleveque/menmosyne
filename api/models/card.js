import mongoose from "mongoose";
const { Schema, model } = mongoose;

const cardSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
  },
  { timestamps: true }
);

export default model("Card", cardSchema);
