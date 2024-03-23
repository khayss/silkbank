import { SignupState, SignupStateAction } from "../types/signup.types";

export const initialState = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  tel: "",
  address: "",
};

export const stateReducer = (
  state: SignupState,
  action: SignupStateAction
): SignupState => {
  switch (action.type) {
    case "ADDRESS":
      return {
        ...state,
        address: action.payload,
      };
    case "EMAIL":
      return { ...state, email: action.payload };
    case "FIRSTNAME":
      return { ...state, firstname: action.payload };
    case "LASTNAME":
      return { ...state, lastname: action.payload };
    case "PASSWORD":
      return { ...state, password: action.payload };
    case "TEL":
      return { ...state, tel: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};
