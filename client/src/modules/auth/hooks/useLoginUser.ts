import { useState } from "react";
import { LoginBody, LoginResponse } from "../pages/login/types/login.types";
import { loginUserApi } from "../api/userApi";
import {
  loginErrorResponseSchema,
  loginSuccessResponseSchema,
} from "../pages/login/utils/validateLogin";

const useLoginUser = () => {
  const [loginUserResponse, setLoginUserResponse] = useState<LoginResponse>();
  const loginUser = async (payload: LoginBody) => {
    try {
      const response = await loginUserApi(payload);

      if (response) {
        if (typeof response === "string") {
          setLoginUserResponse({ success: false, message: response });
        } else {
          const isSuccessResponse = loginSuccessResponseSchema.safeParse(
            response.data
          );

          if (isSuccessResponse.success) {
            setLoginUserResponse(isSuccessResponse.data);
          } else {
            const isErrorResponse = loginErrorResponseSchema.safeParse(
              response.data
            );

            if (isErrorResponse.success) {
              setLoginUserResponse(isErrorResponse.data);
            } else {
              throw new Error("server responded with invalid data");
            }
          }
        }
      } else {
        throw new Error("server did not respond, try again later");
      }
    } catch (error) {
      setLoginUserResponse({
        success: false,
        message: error instanceof Error ? error.message : "",
      });
    }
  };
  return { loginUserResponse, loginUser };
};

export default useLoginUser;
