import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import importRoutes from "./routes/imports.js";
import collectionRoutes from "./routes/collections.js";
import cardRoutes from "./routes/cards.js";
import sessionRoutes from "./routes/dailySessions.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(bodyParser.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/ankiImports", express.static(path.join(__dirname, "ankiImports")));

app.use("/auth", authRoutes);

app.use("/collections", collectionRoutes);

app.use("/cards", cardRoutes);

app.use("/import", importRoutes);

app.use("/sessions", sessionRoutes);

app.use((req, res) => {
  return res.send("Hello the world");
});

app.use((err, req, res) => {
  const { message } = err;
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message });
});

export default app;
