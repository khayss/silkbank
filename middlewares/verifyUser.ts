import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const verifyUser: RequestHandler = (req, res, next) => {
  const userToken = req.cookies["userToken"] as string;
  jwt.verify(userToken, process.env.JWT_SECRET!, (err, token) => {
    if (token) {
      next();
    } else {
      throw new Error("user not logged in");
    }
  });
};
