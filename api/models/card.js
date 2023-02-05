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

cardSchema.statics.countDocs = async function (query) {
  const count = await this.count(query);
  return count;
};

cardSchema.statics.getCard = async function (query) {
  const card = await this.findOne(query).populate("cardCollection").exec();
  return card;
};

cardSchema.statics.getCards = async function (query, offset = 0, limit = 10) {
  const cards = await this.find(query).skip(offset).limit(limit).exec();
  return cards;
};

cardSchema.statics.deleteCard = async function (cardId) {
  const card = await this.findByIdAndDelete(cardId)
    .populate("cardCollection")
    .exec();
  const collection = card.cardCollection;
  collection.numCards -= 1;
  await collection.save();
  return card;
};

cardSchema.statics.deleteCards = async function (query) {
  const cards = await this.deleteMany(query).exec();
  return cards;
};

export default model("Card", cardSchema);
