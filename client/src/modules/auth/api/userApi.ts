import { SignupBody } from "../pages/signup/utils/validateFormInput";
import { userAxios } from ".";
import { AxiosError } from "axios";
import { LoginBody } from "../pages/login/types/login.types";
export const signupUserApi = async (payload: SignupBody) => {
  try {
    const response = await userAxios.post("/signup", JSON.stringify(payload), {
      withCredentials: true,
      headers: {
        "Content-Type": "Application/json",
      },
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return error.response;
      } else {
        return error.message;
      }
    } else {
      return "Server Error! Please Try Again Later.";
    }
  }
};

export const loginUserApi = async (payload: LoginBody) => {
  try {
    const response = await userAxios.post("/login", JSON.stringify(payload), {
      withCredentials: true,
      headers: { "Content-Type": "Application/json" },
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return error.response;
      } else {
        return error.message;
      }
    } else {
      return "Server Error! Please Try Again Later";
    }
  }
};

export const getCurrentUserApi = async () => {
  try {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      const response = await userAxios.get("/get-current-user", {
        headers: {
          Authorization: `Bearer ${JSON.parse(userToken)}`,
        },
      });
      if (response) {
        return response;
      } else {
        throw new Error("server did not respond");
      }
    } else {
      throw new Error("No token found!");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return error.response;
      } else {
        return error.message;
      }
    } else {
      return "error fetching currentuser";
    }
  }
};
