import app from "./server.js";
import mongoose from "mongoose";

const mongoUrl = "mongodb://mongo:27017/mnemosyne";

const main = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      user: "testUser",
      pass: "testPwd",
    });
    console.log("Connection successful to mongodb");
    app.listen(8080);
  } catch (err) {
    console.log(err);
  }
};

main();
