export interface SignupState {
  firstname: string;
  lastname: string;
  email: string;
  tel: string;
  address: string;
  password: string;
}

export type SignupStateAction =
  | Reset
  | Email
  | Firstname
  | Lastname
  | Address
  | Password
  | Tel;
interface Reset {
  type: "RESET";
}
interface Email {
  type: "EMAIL";
  payload: string;
}
interface Firstname {
  type: "FIRSTNAME";
  payload: string;
}
interface Lastname {
  type: "LASTNAME";
  payload: string;
}
interface Address {
  type: "ADDRESS";
  payload: string;
}
interface Password {
  type: "PASSWORD";
  payload: string;
}
interface Tel {
  type: "TEL";
  payload: string;
}
