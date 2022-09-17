import Card from "../models/card.js";
import User from "../models/user.js";
import path from "path";
import fs from "fs";
import { validationResult } from "express-validator";

const ITEMS_PER_PAGE = 2;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getCards = async (req, res, next) => {
  const page = +req.query.page || 1;
  try {
    const totalCards = await Card.find().countDocuments();
    const cards = await Card.find()
      .populate("owner")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .exec();
    return res.status(200).json({ cards: cards, totalCards: totalCards });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const createCard = async (req, res, next) => {
  const { rectoContent, versoContent, title } = req.body;
  const { userId } = req;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const statusCode = 422;
      const message = "Something in validation went wrong";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }
    let card = {
      rectoContent,
      versoContent,
      title,
      owner: userId,
    };
    card = new Card(card);
    await card.save();
    const owner = await User.findById(userId).exec();
    creator.posts.push(post);
    await creator.save();
    return res
      .status(201)
      .json({ post, creator: { _id: creator._id, name: creator.name } });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).populate("creator").exec();
    if (!post) {
      const err = new Error("Not post was found for this ID");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req;
  const errors = validationResult(req);
  const { title, content } = req.body;
  let imageUrl = req.body.image;
  try {
    if (!errors.isEmpty()) {
      const statusCode = 422;
      const message = "Something in validation went wrong";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }

    const post = await Post.findById(postId).exec();
    if (!post) {
      const err = new Error("Not post was found for this ID");
      err.statusCode = 404;
      throw err;
    }
    if (post.creator._id.toString() !== userId) {
      const err = new Error("You are not the author of this post !");
      err.statusCode = 401;
      throw err;
    }
    if (req.file) {
      imageUrl = req.file.path;
    }
    if (!imageUrl) {
      const err = new Error("No file picked.");
      err.statusCode = 422;
      throw err;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.content = content;
    post.title = title;
    post.imageUrl = imageUrl;
    const result = await post.save();
    res.status(200).json({ message: "postUpdated", post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req;
  try {
    const post = await Post.findById(postId).exec();
    if (!post) {
      const err = new Error("Not post was found for this ID");
      err.statusCode = 404;
      throw err;
    }
    if (post.creator._id.toString() !== userId) {
      const err = new Error("You are not the author of this post !");
      err.statusCode = 401;
      throw err;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndDelete(postId).exec();
    const user = await User.findById(userId).exec();
    user.posts.pull(postId);
    await user.save();
    res.status(200).json({ message: "Post was deleted" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getStatus = async (req, res, next) => {
  const { userId } = req;
  try {
    const user = await User.findById(userId).exec();
    return res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  const { userId } = req;
  const { status } = req.body;
  try {
    const user = await User.findById(userId).exec();
    user.status = status;
    user.save();
    return res.status(201).json({ message: "Status Updated" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (imageUrl) => {
  const imagePath = path.join(__dirname, "..", imageUrl);
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
};
