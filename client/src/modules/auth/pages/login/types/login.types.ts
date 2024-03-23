import { z } from "zod";
import {
  loginErrorResponseSchema,
  loginInputSchema,
  loginSuccessResponseSchema,
} from "../utils/validateLogin";
export type LoginBody = z.infer<typeof loginInputSchema>;

//login success server response
export type LoginSuccessResponse = z.infer<typeof loginSuccessResponseSchema>;
export type LoginErrorResponse = z.infer<typeof loginErrorResponseSchema>;

//login server response types
export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;
// types for login user reducer

interface Email {
  type: "EMAIL";
  payload: string;
}

interface Password {
  type: "PASSWORD";
  payload: string;
}

interface Reset {
  type: "RESET";
}

export type LoginAction = Email | Password | Reset;
