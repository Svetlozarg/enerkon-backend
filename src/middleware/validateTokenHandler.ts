import asyncHandler from "express-async-handler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const validateToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer")) {
      token = (authHeader as string).split(" ")[1];
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err, decoded) => {
          if (err) {
            res.status(401);
            throw new Error("User is not authorized");
          }
          (req as any).user = (decoded as JwtPayload)?.user;
          next();
        }
      );

      if (!token) {
        res.status(401);
        throw new Error("User is not authorized or token is missing");
      }
    }
  }
);
