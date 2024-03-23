import { LoginAction, LoginBody } from "../types/login.types";

export const loginInputReducer = (state: LoginBody, action: LoginAction) => {
  switch (action.type) {
    case "EMAIL":
      return { ...state, email: action.payload };
    case "PASSWORD":
      return { ...state, password: action.payload };
    default:
      return state;
  }
};
