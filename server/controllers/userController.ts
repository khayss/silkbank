import { RequestHandler, Response, Request } from "express";
import {
  getUserBy,
  verifyUserLoginPayload,
  verifyUserSignupPayload,
  verifyUserTxnPayload,
} from "../utils/payloadVerifier";
import { NewUser } from "../types/User";
import { Login, ResetPassword } from "../types/Common";
import { userDB } from "../databases/UserDB";
import { genAccountNumber } from "../utils/genAccountNumber";
import {
  creditAndUpdateUserBalance,
  getCurrentBalance,
  getCurrentUserDetails,
  getUser,
  normalizeData,
  recordTxn,
  // verifyAndGetUser,
  verifyAndGetUserbyAccount,
} from "../utils/userDBQueries";
import { hashPassword } from "../utils/hashPassword";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { sendMail } from "../utils/sendMail";
import { catchError } from "../utils/catchError";
import { UserError } from "../types/UserError";
import { findbyAccountNumber, getUserDetails } from "../utils/adminDBQueries";
import { TxnReceipt, UserTxn } from "../types/Transaction";

const signupUser: RequestHandler = catchError(
  async (req: Request, res: Response) => {
    if (verifyUserSignupPayload(req.body)) {
      const { email, firstname, lastname, password, tel, address } =
        req.body as NewUser;
      if (password.length > 7) {
        const result = await getUser(email);
        if (result.length === 0) {
          const hashedpassword = await hashPassword(password);
          const text =
            "INSERT INTO users(email, firstname, lastname, password, tel, address, account_number) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";
          const values = normalizeData(
            email,
            firstname,
            lastname,
            hashedpassword,
            tel || "",
            address || "",
            genAccountNumber()
          );
          const response = await userDB.query(text, values);
          console.log(response.rows);
          res
            .status(201)
            .json({ success: true, message: "user account created" });
        } else {
          throw new UserError(
            process.env.USER_ERROR_2!,
            "user with this email already exist",
            400
          );
        }
      } else {
        throw new UserError(
          process.env.USER_ERROR_6!,
          "password too short. password length must be 8 or more characters",
          400
        );
      }
    } else {
      throw new UserError(
        process.env.USER_ERROR_1!,
        "bad request. the request body is invalid or incomplete",
        400
      );
    }
  }
);

const loginUser: RequestHandler = catchError(
  async (req: Request, res: Response) => {
    if (verifyUserLoginPayload(req.body)) {
      const { email, password } = req.body as Login;
      const result = await getUser(email.trim().toLowerCase(), "full");
      if (result.length !== 0) {
        const user = result[0];
        const isPassword = await bcrypt.compare(password.trim(), user.password);
        if (isPassword) {
          const period = 60 * 60 * 24;
          await jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET!,
            {
              expiresIn: period,
            },
            async (err, userToken) => {
              if (err) {
                console.log(`error  in signing token: ${err.message}`);
                throw new UserError(
                  process.env.USER_ERROR_5!,
                  "something went wrong",
                  500
                );
              }
              res.cookie("userToken", userToken, {
                maxAge: 1000 * period,
                httpOnly: true,
              });
              res.status(200).json({
                success: true,
                message: "user logged in successfully",
                userToken,
              });
              // const text = `New login detected at ${new Date()}`;
              // await sendMail(user.email, "Sign in Notification", text);
            }
          );
        } else {
          throw new UserError(
            process.env.USER_ERROR_4!,
            "password is incorrect",
            400
          );
        }
      } else {
        throw new UserError(
          process.env.USER_ERROR_3!,
          "user with this email does not exist",
          404
        );
      }
    } else {
      throw new UserError(
        process.env.USER_ERROR_1!,
        "bad request. the request body is invalid or incomplete",
        400
      );
    }
  }
);

const logoutUser: RequestHandler = catchError((req: Request, res: Response) => {
  res.cookie("userToken", "", { maxAge: 0, httpOnly: true });
  res.status(200).json({ success: true, message: "user logged out" });
});

const resetUserPassword: RequestHandler = catchError(
  async (req: Request, res: Response) => {
    const { email } = req.body as ResetPassword;
    if (email) {
      const result = await getUser(email, "id");
      if (result.length > 0) {
        const user = result[0];
        await jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET!,
          {
            expiresIn: 5 * 60,
          },
          async (err, token) => {
            if (err) {
              throw new UserError(
                process.env.USER_ERROR_5!,
                "something went wrong",
                500
              );
            }
            // const text = `use this link to reset your password: http://localhost:${process.env.PORT}${process.env.USER_API_VERSION}/reset-password/${user.id}/${token}`;
            res.cookie("userToken", "", { maxAge: 0, httpOnly: true });
            res
              .status(200)
              .json({ success: true, message: "password reset link sent" });
            console.log(
              `http://localhost:${process.env.PORT}${process.env.USER_API_VERSION}/reset-password/${user.id}/${token}`
            );
            // await sendMail(user.email, "Reset Password", text);
          }
        );
      } else {
        throw new UserError(
          process.env.USER_ERROR_3!,
          "user with this email does not exist",
          404
        );
      }
    } else {
      throw new UserError(
        process.env.USER_ERROR_1!,
        "bad request. the request body is invalid or incomplete",
        400
      );
    }
  }
);

const updateUserPassword: RequestHandler = catchError(async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  if (password) {
    if (password.length >= 8) {
      await jwt.verify(
        token,
        process.env.JWT_SECRET!,
        async (err, verifiedToken) => {
          if (err) {
            throw new UserError(
              process.env.USER_ERROR_5!,
              "something went wrong",
              500
            );
          }
          const hashedpassword = await hashPassword(password);
          const text = "UPDATE users SET password=$1 WHERE id=$2";
          const response = await userDB.query(text, [
            hashedpassword,
            parseInt(id),
          ]);
          console.log("password updated\n", response);
          res.cookie("userToken", "", { maxAge: 0, httpOnly: true });
          res
            .status(201)
            .json({ success: true, message: "password updated successfully" });
        }
      );
    } else {
      throw new UserError(
        process.env.USER_ERROR_1!,
        "bad request. the request body is invalid or incomplete",
        400
      );
    }
  } else {
    throw new UserError(
      process.env.USER_ERROR_1!,
      "bad request. the request body is invalid or incomplete",
      400
    );
  }
});

const getUserToCredit: RequestHandler = catchError(async (req, res) => {
  const getUser = getUserBy(req.body);
  if (getUser === "account-number") {
    const { accountnumber } = req.body;
    if (
      accountnumber.trim().length === 10 &&
      !Number.isNaN(parseInt(accountnumber.trim()))
    ) {
      const result = await getUserDetails(
        "user",
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
      "user",
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

const transfer: RequestHandler = catchError(async (req, res) => {
  if (verifyUserTxnPayload(req.body)) {
    const { usercode, useraccount, accountnumber, amount } =
      req.body as UserTxn;
    if (!Number.isNaN(parseFloat(amount.trim()))) {
      if (
        accountnumber.trim().length === 10 &&
        !Number.isNaN(parseInt(accountnumber.trim()))
      ) {
        if (
          usercode.trim().length === 4 &&
          !Number.isNaN(parseInt(usercode.trim()))
        ) {
          const receiverResult = await findbyAccountNumber(accountnumber);
          if (receiverResult.length > 0) {
            const receiver = receiverResult[0];
            const senderResult = await verifyAndGetUserbyAccount(
              useraccount.trim().toLowerCase(),
              parseInt(usercode)
            );
            if (senderResult.length > 0) {
              const sender = senderResult[0];
              if (!sender.status) {
                const [senderPrevBal, receiverPrevBal] = await Promise.all([
                  getCurrentBalance(sender.account_number.trim()),
                  getCurrentBalance(accountnumber.trim()),
                ]);
                const txnAmount = Math.abs(
                  Number(parseFloat(amount).toFixed(2))
                );
                if (senderPrevBal > txnAmount) {
                  const senderNewBal = senderPrevBal - txnAmount;

                  const receiverNewBal = receiverPrevBal + txnAmount;
                  await Promise.all([
                    creditAndUpdateUserBalance(
                      accountnumber.trim(),
                      receiverNewBal
                    ),
                    creditAndUpdateUserBalance(
                      sender.account_number.trim(),
                      senderNewBal
                    ),
                  ]);
                  const txnReceipt: TxnReceipt = [
                    sender.email.trim(),
                    sender.account_number.trim(),
                    receiver.account_number.trim(),
                    receiver.email.trim(),

                    "credit",
                    "NOW()",
                    txnAmount,
                    "successful",
                  ];

                  await recordTxn(txnReceipt);
                  res.status(201).json({
                    success: true,
                    message: "amount credited to user",
                  });
                } else {
                  throw new Error("insufficient funds");
                }
              } else {
                throw new Error(
                  "this account is suspended! can't carry out this txn at the moment"
                );
              }
            } else {
              throw new Error("user code is incorrect");
            }
          } else {
            throw new Error("no user with this account number exists");
          }
        } else {
          throw new Error("user code is invalid");
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
const getCurrentUser: RequestHandler = catchError(async (req, res) => {
  const payload = req.get("Authorization");
  if (payload) {
    const token = payload.split(" ")[1];
    if (token) {
      const validationResult = (await jwt.verify(
        token,
        process.env.JWT_SECRET!
      )) as { id: number };
      if (validationResult) {
        const currentUser = await getCurrentUserDetails(validationResult.id);
        res.status(200).json({
          success: true,
          message: "here's the current user",
          data: currentUser[0],
        });
      } else {
        throw new Error("error validating token. sign in to get a new token");
      }
    } else {
      throw new Error("invalid authorization header");
    }
  }
});
export {
  signupUser,
  loginUser,
  logoutUser,
  resetUserPassword,
  updateUserPassword,
  getUserToCredit,
  transfer,
  getCurrentUser,
};
