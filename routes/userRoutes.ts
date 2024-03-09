import { Router } from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  signupUser,
  updatePassword,
} from "../controllers/userController";
import { verifyUser } from "../middlewares/verifyUser";

const userRouter = Router();

userRouter
  .post("/signup", signupUser)
  .post("/login", loginUser)
  .post("/reset-password", forgotPassword)
  .patch("/reset-password/:id/:token", updatePassword)
  .use(verifyUser)
  .get("/logout", logoutUser);

export { userRouter };
