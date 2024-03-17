import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { catchError } from "../utils/catchError";

export const verifyAdmin: RequestHandler = catchError(
  async (req, res, next) => {
    const adminToken = req.cookies["adminToken"] as string;

    await jwt.verify(adminToken, process.env.JWT_SECRET!, (err, token) => {
      if (token) {
        next();
      } else {
        throw new Error("you need to login to carry out this action");
      }
    });
  }
);
