import { userDB } from "../databases/UserDB";
import { User } from "../types/User";

export const getUser = async (email: string, full?: "id" | "full") => {
  if (full && full === "full") {
    const text = "SELECT * FROM users WHERE email=$1";
    const response = await userDB.query(text, [email]);
    return response.rows as User[];
  } else if (full && full === "id") {
    const text = "SELECT id, email FROM users WHERE email=$1";
    const response = await userDB.query(text, [email]);
    return response.rows as User[];
  } else {
    const text = "SELECT email FROM users WHERE email=$1";
    const response = await userDB.query(text, [email]);
    return response.rows as User[];
  }
};

export const normalizeData = (
  email: string,
  firstname: string,
  lastname: string,
  hashedpassword: string,
  tel: string,
  address: string,
  accountNumber: string
) => {
  return [
    email.trim().toLowerCase(),
    firstname.trim().toLowerCase(),
    lastname.trim().toLowerCase(),
    hashedpassword,
    tel.trim(),
    address.trim(),
    accountNumber,
  ];
};

