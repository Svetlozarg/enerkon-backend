import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

//@desc Register a user
//!@route POST /api/users/register
//@access public
export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }

    const userAvailable = await User.findOne({ email });

    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered!");
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log(`User created ${user}`);
    if (user) {
      res.status(201).json({ _id: user.id, email: user.email });
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
    res.json({ message: "Register the user" });
  }
);

//@desc Login user
//!@route POST /api/users/login
//@access public
export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!process.env.ACCESS_TOKEN_SECERT) {
        res.status(500);
        throw new Error("Access token secret is not defined");
      }

      const accessToken: string = jwt.sign(
        {
          user: {
            username: user.username,
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECERT,
        { expiresIn: "24h" }
      );
      res
        .status(200)
        .json({ _id: user.id, email: user.email, accessToken: accessToken });
    } else {
      res.status(401);
      throw new Error("email or password is not valid");
    }
  }
);
