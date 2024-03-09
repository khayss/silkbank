import { ErrorRequestHandler } from "express";
import { UserError } from "../types/UserError";

export const handleError: ErrorRequestHandler = (err, req, res, next) => {
  const response = { success: false, message: err.message };
  if (err instanceof UserError) {
    console.log(err.errorCode, err.message);
    res.status(err.statusCode).json(response);
  } else {
    console.log(err.message);
    res.status(500).json({ ...response, message: "something went wrong!" });
  }
};
