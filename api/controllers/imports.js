import path from "path";
import { fileURLToPath } from "url";
import ankiToJson from "../lib/readAnki/index.js";
import CardCollection from "../models/cardCollection.js";
import Card from "../models/card.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

export const importFromAnki = async (req, res, next) => {
  const { file, userId } = req;
  //   const errors = validationResult(req);
  try {
    if (!file) {
      const statusCode = 422;
      const message = "File is required";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }
    const filePath = file.path;
    const fileName = file.originalname.split(".")[0];
    const splitPath = filePath.split("/")
    const collectionName = splitPath[splitPath.length - 2]
    const destPath = `${__dirname}/ankiImports/${userId.toString()}/${fileName}`;
    ankiToJson(filePath, destPath, async (jsonCards) => {
      let cardCollection = {
        owner: userId,
        name: collectionName,
        numCards: jsonCards.length,
      };
      cardCollection = new CardCollection(cardCollection);
      await cardCollection.save();
      jsonCards.forEach(async (card) => {
        let formattedCard = {
          rectoContent: card.front,
          versoContent: card.back,
          cardCollection: cardCollection.id,
        };
        formattedCard = new Card(formattedCard);
        await formattedCard.save();
      })
    });
    return res.status(200).json({ message: "File has been uploaded" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
