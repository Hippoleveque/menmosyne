import app from "./server.js";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL;

const main = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connection successful to mongodb");
    app.listen(8080);
  } catch (err) {
    console.log(err);
  }
};

main();

mongodb+srv://hippolyte:Eragon123@cluster-personal.p7sdom6.mongodb.net/mnemosyne?retryWrites=true&w=majority