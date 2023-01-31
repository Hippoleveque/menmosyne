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

cardSchema.statics.count = async function (query) {
  const count = await this.find(query).countDocuments();
  return count;
};

cardSchema.statics.getCards = async function (query, offset = 0, limit = 10) {
  const cards = await this.find(query).skip(offset).limit(limit).exec();
  return cards;
};

export default model("Card", cardSchema);
