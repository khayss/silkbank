import { userDB } from "../databases/UserDB";
import { TxnReceipt } from "../types/Transaction";
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

export const getCurrentBalance = async (accountNumber: string) => {
  const text = "SELECT balance FROM users WHERE account_number=$1";
  const result = await userDB.query(text, [accountNumber]);
  return parseFloat(result.rows[0].balance);
};

export const creditAndUpdateUserBalance = async (
  accountNumber: string,
  amount: number
) => {
  const text =
    "UPDATE users SET balance=$1 WHERE account_number=$2 RETURNING *";
  const result = await userDB.query(text, [amount, accountNumber]);
  console.log("user credited:");
  console.log(result.rows);
};

export const recordTxn = async (array: TxnReceipt) => {
  const text =
    "INSERT INTO transactions(from_user, from_account, to_account, to_user, type, at, amount, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
  const result = await userDB.query(text, array);
  console.log("new txn!");
  console.log(result.rows);
};

export const verifyAndGetUser = async (userEmail: string, userCode: number) => {
  const text =
    "SELECT email, account_number, status FROM users WHERE email=$1 and user_pin=$2";
  const result = await userDB.query(text, [userEmail, userCode]);
  return result.rows as {
    email: string;
    account_number: string;
    status: boolean;
  }[];
};
export const verifyAndGetUserbyAccount = async (
  account: string,
  userCode: number
) => {
  const text =
    "SELECT email, account_number, status FROM users WHERE account_number=$1 and user_pin=$2";
  const result = await userDB.query(text, [account, userCode]);
  return result.rows as {
    email: string;
    account_number: string;
    status: boolean;
  }[];
};

export const getCurrentUserDetails = async (id: number) => {
  const text =
    "SELECT email, account_number, status, balance, address, tel, firstname, lastname FROM users WHERE id=$1";
  const result = await userDB.query(text, [id]);
  if (result.rows.length > 0) {
    return result.rows;
  } else {
    throw new Error("no user that matches the request parameters");
  }
};
