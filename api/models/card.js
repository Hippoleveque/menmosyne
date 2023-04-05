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
    priority: {
      type: Number,
      required: false,
      default: 1,
    },
    lastReviewed: {
      type: Date,
      required: false,
    },
    easinessFactor: {
      type: Number,
      default: 2.5,
    },
    numberReviewed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

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
  await collection.save();
  return card;
};

cardSchema.statics.deleteCards = async function (query) {
  const cards = await this.deleteMany(query).exec();
  return cards;
};

export default model("Card", cardSchema);
