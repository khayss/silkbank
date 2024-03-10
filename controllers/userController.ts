import { RequestHandler, Response, Request } from "express";
import {
  verifyUserLoginPayload,
  verifyUserSignupPayload,
} from "../utils/payloadVerifier";
import { NewUser } from "../types/User";
import { Login, ResetPassword } from "../types/Common";
import { userDB } from "../databases/UserDB";
import { genAccountNumber } from "../utils/genAccountNumber";
import { getUser, normalizeData } from "../utils/userDBQueries";
import { hashPassword } from "../utils/hashPassword";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendMail } from "../utils/sendMail";
import { catchError } from "../utils/catchError";
import { UserError } from "../types/UserError";

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
            async (err, token) => {
              if (err) {
                console.log(`error  in signing token: ${err.message}`);
                throw new UserError(
                  process.env.USER_ERROR_5!,
                  "something went wrong",
                  500
                );
              }
              res.cookie("userToken", token, {
                maxAge: 1000 * period,
                httpOnly: true,
              });
              res.status(200).json({
                success: true,
                message: "user logged in successfully",
                user: { ...user, password: "" },
              });
              const text = `New login detected at ${new Date()}`;
              await sendMail(user.email, "Sign in Notification", text);
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

const forgotPassword: RequestHandler = catchError(
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
            const text = `use this link to reset your password: http://localhost:${process.env.PORT}${process.env.USER_API_VERSION}/reset-password/${user.id}/${token}`;
            res.cookie("userToken", "", { maxAge: 0, httpOnly: true });
            res
              .status(200)
              .json({ success: true, message: "password reset link sent" });
            await sendMail(user.email, "Reset Password", text);
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

const updatePassword: RequestHandler = catchError(async (req, res) => {
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
          const text = "UPDATE users SET password=$1 WHERE ID=$2";
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

export { signupUser, loginUser, logoutUser, forgotPassword, updatePassword };
