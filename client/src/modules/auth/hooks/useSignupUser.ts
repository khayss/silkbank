import { useState } from "react";
import { z } from "zod";
import { SignupBody } from "../pages/signup/utils/validateFormInput";
import { signupUserApi } from "../api/userApi";

// type Props = {}
const ResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
});
type SignupResponse = z.infer<typeof ResponseSchema>;

function useSignupUser() {
  const [signupUserResponse, setSignupUserResponse] =
    useState<SignupResponse>();

  const signupUser = async (state: SignupBody) => {
    try {
      const response = await signupUserApi(state);
      if (response) {
        if (typeof response === "string") {
          throw new Error(response);
        } else {
          const parsedData = ResponseSchema.safeParse(response.data);
          if (parsedData.success) {
            setSignupUserResponse(parsedData.data);
          } else {
            throw new Error("server responded with invalid data");
          }
        }
      } else {
        throw new Error("server did not respond");
      }
    } catch (error) {
      if (error instanceof Error) {
        setSignupUserResponse({ success: false, message: error.message });
      } else {
        setSignupUserResponse({
          success: false,
          message: "something went wrong signing up user",
        });
      }
    }
  };
  return { signupUserResponse, signupUser };
}

export default useSignupUser;
