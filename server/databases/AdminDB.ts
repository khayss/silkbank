import { Client } from "pg";

const adminDB = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.ADMIN_DB,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

const connectAdminDB = async () => {
  try {
    await adminDB.connect();
    console.log("connected to admin database");
  } catch (error: any) {
    console.log(error.message);
  }
};

export { adminDB, connectAdminDB };
