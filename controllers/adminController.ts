import { RequestHandler } from "express";
import bycrypt from "bcrypt";
import { catchError } from "../utils/catchError";
import {
  verifyAdminLoginPayload,
  verifyAdminSignupPayload,
} from "../utils/payloadVerifier";
import { NewAdmin } from "../types/Admin";
import {
  checkEmail,
  deactivateAdminToken,
  getAdminPassword,
  normalizeAdminData,
  registerAdmin,
  verifyAdminToken,
} from "../utils/adminDBQueries";
import { hashPassword } from "../utils/hashPassword";
import { Login } from "../types/Common";
import jwt from "jsonwebtoken";

export const signupAdmin: RequestHandler = catchError(async (req, res) => {
  if (verifyAdminSignupPayload(req.body)) {
    const {
      admintoken: adminToken,
      password,
      email,
      firstname,
      lastname,
    } = req.body as NewAdmin;
    const emailExist = await checkEmail(email);
    if (!emailExist) {
      if (password.trim().length > 7) {
        const result = await verifyAdminToken(adminToken.trim().toUpperCase());
        if (result) {
          const hashedPassword = await hashPassword(password);
          const values = normalizeAdminData(
            email,
            firstname,
            lastname,
            hashedPassword
          );

          await deactivateAdminToken(
            adminToken.trim().toUpperCase(),
            email.trim().toLowerCase()
          );
          await registerAdmin(values);

          res.status(201).json({
            success: true,
            message: "admin account created successfully",
          });
        } else {
          throw new Error("invalid admin token");
        }
      } else {
        throw new Error(
          "password too short. password must be container 8 or more characters"
        );
      }
    } else {
      throw new Error("admin with this email exists already");
    }
  } else {
    throw new Error("bad request. invalid or incomplete request body");
  }
});

export const loginAdmin: RequestHandler = catchError(async (req, res) => {
  if (verifyAdminLoginPayload(req.body)) {
    const { email, password } = req.body as Login;
    const emailExist = await checkEmail(email.trim().toLowerCase());
    if (emailExist) {
      const adminPassword = await getAdminPassword(email.trim().toLowerCase());
      const isCorrect = await bycrypt.compare(password, adminPassword);
      if (isCorrect) {
        const period = 60 * 60 * 24;
        await jwt.sign(
          { email },
          process.env.JWT_SECRET!,
          { expiresIn: period },
          (err, token) => {
            if (err) {
              throw new Error("error at signing user");
            }
            res.cookie("adminToken", token, {
              maxAge: period * 1000,
              httpOnly: true,
            });
            res
              .status(200)
              .json({ success: true, message: "admin sign in successfully" });
          }
        );
      } else {
        throw new Error("password is incorrect");
      }
    } else {
      throw new Error("admin with this email does not exist");
    }
  } else {
    throw new Error("bad request. invalid or incomplete request body");
  }
});

export const logoutAdmin: RequestHandler = catchError(async (req, res) => {
  res.cookie("adminToken", "", { maxAge: 0, httpOnly: true });
  res
    .status(200)
    .json({ success: true, message: "admin logged out successfully" });
});
