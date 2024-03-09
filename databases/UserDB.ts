import { Client } from "pg";
const userDB = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.USER_DB,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
const connectUserDB = async () => {
  try {
    await userDB.connect();
    console.log("connected to user database");
  } catch (error: any) {
    console.log(error.message);
  }
};

export { connectUserDB, userDB };
