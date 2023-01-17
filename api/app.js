import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import cardCollectionRoutes from "./routes/cardCollection.js";
import mongoose from "mongoose";

const app = express();
app.use(bodyParser.json());

app.use("/auth", authRoutes);

app.use("/memo", cardCollectionRoutes);

app.use((req, res) => {
  return res.send("Hello the world");
});

app.use((err, req, res) => {
  const { message } = err;
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message });
});

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
