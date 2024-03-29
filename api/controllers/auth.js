import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

export const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const statusCode = 422;
      const message = "Credentials are incorrect";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.createUser(email, hashedPassword);
    res.status(201).json({ message: "User has been created", user: user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.getUser({ email });
    if (!user) {
      const err = new Error("No user with this email address");
      err.statusCode = 401;
      throw err;
    }
    if (!(await bcrypt.compare(password, user.password))) {
      const err = new Error("Invalid password");
      err.statusCode = 401;
      throw err;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );
    const expirationDate = new Date(Date.now() + 3600 * 6 * 1000);
    res
      .status(200)
      .json({ token, userId: user._id.toString(), expirationDate });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
  const { userId } = req;
  try {
    const user = await User.getUser({ _id: userId });
    if (!user) {
      const err = new Error("No user with this email address");
      err.statusCode = 401;
      throw err;
    }
    return res
      .status(200)
      .json({ user: { email: user.email, _id: user._id.toString() } });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
