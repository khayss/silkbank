import { Router } from "express";
import {
  creditUser,
  liftSuspension,
  loginAdmin,
  logoutAdmin,
  resetAdminPassord,
  signupAdmin,
  suspendUser,
  updateAdminPassword,
  userToCredit,
} from "../controllers/adminController";
import { verifyAdmin } from "../middlewares/verifyAdmin";

const adminRouter = Router();

adminRouter
  .post("/signup", signupAdmin)
  .post("/login", loginAdmin)
  .post("/reset-password", resetAdminPassord)
  .patch("/reset-password/:id/:token", updateAdminPassword)
  .use(verifyAdmin)
  .get("/logout", logoutAdmin)
  .post("/get-user", userToCredit)
  .post("/credit-user", creditUser)
  .post("/suspend-user", suspendUser)
  .post("/lift-user-suspension", liftSuspension);

export { adminRouter };
