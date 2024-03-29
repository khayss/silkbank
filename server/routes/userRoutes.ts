import { Router } from "express";
import {
  resetUserPassword,
  loginUser,
  logoutUser,
  signupUser,
  updateUserPassword,
  getUserToCredit,
  transfer,
  getCurrentUser,
} from "../controllers/userController";
import { verifyUser } from "../middlewares/verifyUser";

const userRouter = Router();

userRouter
  .post("/signup", signupUser)
  .post("/login", loginUser)
  .post("/reset-password", resetUserPassword)
  .patch("/reset-password/:id/:token", updateUserPassword)
  .get("/get-current-user", getCurrentUser)
  .use(verifyUser)
  .get("/logout", logoutUser)
  .post("/get-user", getUserToCredit)
  .post("/transfer", transfer);

export { userRouter };
