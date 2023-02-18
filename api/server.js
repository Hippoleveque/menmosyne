import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import importRoutes from "./routes/imports.js";
import cardCollectionRoutes from "./routes/cardCollection.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(bodyParser.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/ankiImports", express.static(path.join(__dirname, "ankiImports")));

app.use("/auth", authRoutes);

app.use("/memo", cardCollectionRoutes);

app.use("/import", importRoutes);

app.use((req, res) => {
  return res.send("Hello the world");
});

app.use((err, req, res) => {
  const { message } = err;
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message });
});

export default app;
