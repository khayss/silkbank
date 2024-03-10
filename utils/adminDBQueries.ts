import { adminDB } from "../databases/AdminDB";

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
