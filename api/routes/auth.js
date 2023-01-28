import express from "express";
import { check } from "express-validator";
import User from "../models/user.js";

import { signup, login } from "../controllers/auth.js";

const router = express.Router();

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const user = await User.getUser({ email: value });
        if (user) {
          throw new Error("This user already exists.");
        }
        return true;
      })
      .normalizeEmail(),
    check(
      "password",
      "Please enter a password at least 5 characters long."
    ).isLength({ min: 5 }),
  ],
  signup
);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    check(
      "password",
      "Please enter a password at least 5 characters long."
    ).isLength({ min: 5 }),
  ],
  login
);

export default router;
