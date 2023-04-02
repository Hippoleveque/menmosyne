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
