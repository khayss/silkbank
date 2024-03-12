import { RequestHandler } from "express";
import bycrypt from "bcrypt";
import { catchError } from "../utils/catchError";
import {
  getUserBy,
  verifyAdminLoginPayload,
  verifyAdminSignupPayload,
  verifyAdminTxnPayload,
  verifySuspendUserPayload,
} from "../utils/payloadVerifier";
import { NewAdmin } from "../types/Admin";
import {
  checkEmail,
  deactivateAdminToken,
  effectUserSuspension,
  findAdminById,
  findAndReplaceAdminPassword,
  findbyAccountNumber,
  getAdminId,
  getAdminPassword,
  getUserDetails,
  liftUserSuspension,
  normalizeAdminData,
  registerAdmin,
  verifyAdminToken,
  verifyAndGetAdminId,
} from "../utils/adminDBQueries";
import { hashPassword } from "../utils/hashPassword";
import { Login } from "../types/Common";
import jwt from "jsonwebtoken";
// import { sendMail } from "../utils/sendMail";
import { AdminTxn, TxnReceipt } from "../types/Transaction";
import {
  creditAndUpdateUserBalance,
  getCurrentBalance,
  recordTxn,
} from "../utils/userDBQueries";

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

          await registerAdmin(values);
          await deactivateAdminToken(
            adminToken.trim().toUpperCase(),
            email.trim().toLowerCase()
          );

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

export const resetAdminPassord: RequestHandler = catchError(
  async (req, res) => {
    const { email } = req.body;
    if (typeof email === "string") {
      const adminEmail = email.trim().toLowerCase();
      const emailExist = await checkEmail(adminEmail);
      if (emailExist) {
        const adminId = await getAdminId(email);
        await jwt.sign(
          { email },
          process.env.JWT_SECRET!,
          {
            expiresIn: 5 * 60,
          },
          async (err, token) => {
            if (err) {
              throw new Error("JWT error: error signing user:");
            }
            res.cookie("adminToken", "", { maxAge: 0 });
            res.status(200).json({
              success: true,
              message: "password reset link sent to email",
            });
            console.log(
              `use this link to reset your email http://localhost:3000${process
                .env.ADMIN_API_VERSION!}/reset-password/${adminId}/${token}`
            );
            // await sendMail(
            //   adminEmail,
            //   "Reset password",
            //   `use this link to reset your email http://localhost:3000${process
            //     .env.ADMIN_API_VERSION!}/reset-password/${adminId}/${token}`
            // );
          }
        );
      } else {
        throw new Error("admin with this email does not exist");
      }
    } else {
      throw new Error("bad request. invalid or incomplete request body");
    }
  }
);

export const updateAdminPassword: RequestHandler = catchError(
  async (req, res) => {
    const { password } = req.body;
    if (typeof password === "string") {
      const { id, token } = req.params;
      const adminId = parseInt(id);
      if (!Number.isNaN(adminId)) {
        const isAdmin = await findAdminById(adminId);
        if (isAdmin) {
          if (password.trim().length > 7) {
            await jwt.verify(
              token,
              process.env.JWT_SECRET!,
              async (err, token) => {
                if (err) {
                  throw new Error("error verifying token");
                }
                const hashedPassword = await hashPassword(password.trim());
                await findAndReplaceAdminPassword(hashedPassword, adminId);
                res.cookie("adminToken", "", { maxAge: 0 });
                res
                  .status(201)
                  .json({ success: true, message: "admin password updated" });
              }
            );
          } else {
            throw new Error(
              "password is too short. password must consist or 8 or more characters"
            );
          }
        } else {
          throw new Error("can't change password of this admin");
        }
      } else {
        throw new Error("invalid request params");
      }
    } else {
      throw new Error("bad request. invalid or incomplete request body");
    }
  }
);

export const userToCredit: RequestHandler = catchError(async (req, res) => {
  const getUser = getUserBy(req.body);
  if (getUser === "account-number") {
    const { accountnumber } = req.body;
    if (
      accountnumber.trim().length === 10 &&
      !Number.isNaN(parseInt(accountnumber.trim()))
    ) {
      const result = await getUserDetails(
        "admin",
        "account",
        req.body.accountnumber
      );
      if (result.length > 0) {
        res.status(200).json({ success: true, user: result[0] });
      } else {
        throw new Error("user not found");
      }
    } else {
      throw new Error("invalid account number");
    }
  } else if (getUser === "email" || "both") {
    const result = await getUserDetails(
      "admin",
      "email",
      req.body.email.trim().toLowerCase()
    );
    if (result.length > 0) {
      res.status(200).json({ success: true, user: result[0] });
    } else {
      throw new Error("user not found");
    }
  } else if (getUser === "invalid") {
    throw Error("invalid or incomplete request body");
  }
});

export const creditUser: RequestHandler = catchError(async (req, res) => {
  if (verifyAdminTxnPayload(req.body)) {
    const { admincode, adminemail, accountnumber, amount } =
      req.body as AdminTxn;
    if (!Number.isNaN(parseFloat(amount.trim()))) {
      if (
        accountnumber.trim().length === 10 &&
        !Number.isNaN(parseInt(accountnumber.trim()))
      ) {
        if (
          admincode.trim().length === 4 &&
          !Number.isNaN(parseInt(admincode.trim()))
        ) {
          const founduser = await findbyAccountNumber(accountnumber);
          if (founduser.length > 0) {
            const admin = await verifyAndGetAdminId(
              adminemail.trim().toLowerCase(),
              parseInt(admincode)
            );
            if (admin.length > 0) {
              const prevbalance = await getCurrentBalance(accountnumber.trim());
              const creditAmount = Math.abs(
                Number(parseFloat(amount).toFixed(2))
              );
              const newBalance = prevbalance + creditAmount;

              await creditAndUpdateUserBalance(
                founduser[0].account_number,
                newBalance
              );
              const txnReceipt: TxnReceipt = [
                admin[0].id.toString(),
                "SYSTEM",
                founduser[0].account_number,
                founduser[0].email,
                "credit",
                "NOW()",
                creditAmount,
                "successful",
              ];
              await recordTxn(txnReceipt);
              res
                .status(201)
                .json({ success: true, message: "amount credited to user" });
            } else {
              throw new Error("admin code is incorrect");
            }
          } else {
            throw new Error("no user with this account number exists");
          }
        } else {
          throw new Error("admin code is invalid");
        }
      } else {
        throw new Error("account number is invalid");
      }
    } else {
      throw new Error("Invalid Amount");
    }
  } else {
    throw new Error("bad request. invalid or incomplete transaction request");
  }
});

export const suspendUser: RequestHandler = catchError(async (req, res) => {
  if (verifySuspendUserPayload(req.body)) {
    const { admincode, adminemail, accountnumber } = req.body as {
      adminemail: string;
      admincode: string;
      accountnumber: string;
    };
    if (
      accountnumber.trim().length === 10 &&
      !Number.isNaN(parseInt(accountnumber.trim()))
    ) {
      if (
        admincode.trim().length === 4 &&
        !Number.isNaN(parseInt(admincode.trim()))
      ) {
        const result = await findbyAccountNumber(accountnumber.trim());
        if (result.length > 0) {
          const user = result[0];
          const verifyAdmin = await verifyAndGetAdminId(
            adminemail.trim().toLowerCase(),
            parseInt(admincode.trim())
          );
          if (verifyAdmin.length > 0) {
            await effectUserSuspension(user.account_number);
            res.status(201).json({ success: true, message: "user suspended" });
          } else {
            throw new Error("invalid admin  credentials");
          }
        } else {
          throw new Error("No User Found With This Account Number");
        }
      } else {
        throw new Error("invalid admin code");
      }
    } else {
      throw new Error("account number is invalid");
    }
  } else {
    throw new Error("bad request. incomplete or invalid request body");
  }
});

export const liftSuspension: RequestHandler = catchError(async (req, res) => {
  if (verifySuspendUserPayload(req.body)) {
    const { admincode, adminemail, accountnumber } = req.body as {
      adminemail: string;
      admincode: string;
      accountnumber: string;
    };
    if (
      accountnumber.trim().length === 10 &&
      !Number.isNaN(parseInt(accountnumber.trim()))
    ) {
      if (
        admincode.trim().length === 4 &&
        !Number.isNaN(parseInt(admincode.trim()))
      ) {
        const result = await findbyAccountNumber(accountnumber.trim());
        if (result.length > 0) {
          const user = result[0];
          const verifyAdmin = await verifyAndGetAdminId(
            adminemail.trim().toLowerCase(),
            parseInt(admincode.trim())
          );
          if (verifyAdmin.length > 0) {
            await liftUserSuspension(user.account_number);
            res
              .status(201)
              .json({ success: true, message: "user suspension lifted" });
          } else {
            throw new Error("invalid admin  credentials");
          }
        } else {
          throw new Error("No User Found With This Account Number");
        }
      } else {
        throw new Error("invalid admin code");
      }
    } else {
      throw new Error("account number is invalid");
    }
  } else {
    throw new Error("bad request. incomplete or invalid request body");
  }
});
