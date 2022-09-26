import mongoose from "mongoose";
const { Schema, model } = mongoose;

const collectionSchema = new Schema(
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
    numCard: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model("Collection", collectionSchema);
