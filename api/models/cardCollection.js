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

cardCollectionSchema.statics.getCollectionsFromPage = async function (query, pageNumber, pageSize) {
  const collections = await this.find(query)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec();
  return collections;
}

export default model("CardCollection", cardCollectionSchema);
