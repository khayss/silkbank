import { adminDB } from "../databases/AdminDB";
import { userDB } from "../databases/UserDB";
import { UserForAdmin } from "../types/Admin";
import { TxnUser } from "../types/User";

export const verifyAdminToken = async (token: string) => {
  const text =
    "SELECT EXISTS(SELECT 1 FROM admintoken WHERE admin_token=$1 AND use_status=$2)";
  const result = await adminDB.query(text, [token, false]);
  return result.rows[0].exists as boolean;
};

export const checkEmail = async (email: string) => {
  const text = "SELECT EXISTS(SELECT 1 FROM admins WHERE email=$1)";
  const result = await adminDB.query(text, [email]);
  return result.rows[0].exists as boolean;
};

export const normalizeAdminData = (
  email: string,
  firstname: string,
  lastname: string,
  hashedpassword: string
) => {
  return [
    email.trim().toLowerCase(),
    firstname.trim().toLowerCase(),
    lastname.trim().toLowerCase(),
    hashedpassword,
  ];
};

export const registerAdmin = async (data: string[]) => {
  const text =
    "INSERT INTO admins (email, firstname, lastname, password) VALUES($1, $2, $3, $4) RETURNING *";
  const result = await adminDB.query(text, data);
  console.log("admin registered:");
  console.log(result.rows);
};

export const deactivateAdminToken = async (token: string, email: string) => {
  const text =
    "UPDATE admintoken SET use_status=$1, used_by=$2, used_at=$3 WHERE admin_token=$4 RETURNING *";
  const result = await adminDB.query(text, [true, email, "NOW()", token]);
  console.log("admin token deactivated:");
  console.log(result.rows);
};

export const getAdminPassword = async (email: string) => {
  const text = "SELECT password FROM admins WHERE email=$1";
  const result = await adminDB.query(text, [email]);
  return result.rows[0].password as string;
};

export const getAdminId = async (email: string) => {
  const text = "SELECT id FROM admins WHERE email=$1";
  const result = await adminDB.query(text, [email]);
  return result.rows[0].id as number;
};

export const findAdminById = async (id: number) => {
  const text = "SELECT EXISTS (SELECT 1 FROM admins WHERE id=$1)";
  const result = await adminDB.query(text, [id]);
  return result.rows[0].exists as boolean;
};

export const findAndReplaceAdminPassword = async (
  hashedPassword: string,
  adminId: number
) => {
  const text = "UPDATE admins SET password=$1 WHERE id=$2";
  const result = adminDB.query(text, [hashedPassword, adminId]);
  console.log("admin password changed:");
  console.log((await result).rows[0]);
};

export const getUserDetails = async (
  by: "admin" | "user",
  type: "email" | "account",
  detail: string
) => {
  let text: string;
  if (by === "admin") {
    text =
      "SELECT firstname, lastname, account_number, balance FROM users WHERE account_number=$1";
  } else {
    text =
      "SELECT firstname, lastname, account_number,FROM users WHERE account_number=$1";
  }
  if (type === "account") {
    const result = await userDB.query(text, [detail]);
    return result.rows as UserForAdmin[];
  } else {
    const text =
      "SELECT firstname, lastname, account_number FROM users WHERE email=$1";
    const result = await userDB.query(text, [detail]);
    return result.rows as UserForAdmin[];
  }
};

export const findbyAccountNumber = async (accountNumber: string) => {
  const text =
    "SELECT email, account_number FROM users WHERE account_number=$1";
  const result = await userDB.query(text, [accountNumber]);
  return result.rows as TxnUser[];
};

export const verifyAndGetAdminId = async (
  adminEmail: string,
  adminCode: number
) => {
  const text = "SELECT id FROM admins WHERE email=$1 and admin_code=$2";
  const result = await adminDB.query(text, [adminEmail, adminCode]);
  return result.rows as { id: number }[];
};

export const effectUserSuspension = async (accountNumber: string) => {
  const text = "UPDATE users SET status=$1 WHERE account_number=$2 RETURNING *";
  const result = await userDB.query(text, [true, accountNumber]);
  return result.rows[0];
};
export const liftUserSuspension = async (accountNumber: string) => {
  const text = "UPDATE users SET status=$1 WHERE account_number=$2 RETURNING *";
  const result = await userDB.query(text, [false, accountNumber]);
  return result.rows[0];
};
