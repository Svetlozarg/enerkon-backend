import asyncHandler from "express-async-handler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const validateToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(401);
      throw new Error("User is not authorized or token is missing");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401);
      throw new Error("User is not authorized or token is missing");
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECERT
    ) as JwtPayload;
    (req as any).user = decoded.user;
    next();
  }
);
