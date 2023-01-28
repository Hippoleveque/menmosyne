import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import cardCollectionRoutes from "./routes/cardCollection.js";

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

export default app;
