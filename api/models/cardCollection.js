import mongoose from "mongoose";
const { Schema, model } = mongoose;

const cardCollectionSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    numCards: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

cardCollectionSchema.statics.count = async function (query) {
  const count = await this.find(query).countDocuments();
  return count;
};

cardCollectionSchema.statics.getCollections = async function (
  query,
  offset = 0,
  limit = 10
) {
  const collections = await this.find(query).skip(offset).limit(limit).exec();
  return collections;
};

cardCollectionSchema.statics.getCollection = async function (query) {
  const collection = await this.findOne(query).exec();
  return collection;
};

export default model("CardCollection", cardCollectionSchema);
