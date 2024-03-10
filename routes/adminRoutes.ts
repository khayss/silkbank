import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  signupAdmin,
} from "../controllers/adminController";

const adminRouter = Router();

adminRouter
  .post("/signup", signupAdmin)
  .post("/login", loginAdmin)
  .get("/logout", logoutAdmin)
  .post("/reset-password")
  .post("/reset-password/:id/:token")
  .post("/credit-user")
  .post("/suspend-user");

export { adminRouter };
