import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    cards: [
      {
        type: Schema.Types.ObjectId,
        ref: "Card",
      },
    ],
  },
  { timestamps: true }
);

userSchema.statics.createUser = async function (email, password) {
  const user = new this({
    email,
    password,
  });
  await user.save();
  return user;
};

userSchema.statics.getUser = async function (query) {
  const user = await this.findOne(query).exec();
  return user;
};

export default model("User", userSchema);
