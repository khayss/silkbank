import "dotenv/config";
import express from "express";
import { userRouter } from "./routes/userRoutes";
import { connectUserDB } from "./databases/UserDB";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import morgan from "morgan";
import { handleError } from "./middlewares/handleError";
import { connectAdminDB } from "./databases/AdminDB";

const app = express();
const port = Number(process.env.PORT) || 8080;
app
  .use(morgan("dev"))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cookieParser())
  .use(methodOverride("method_"))

  .use(process.env.USER_API_VERSION!, userRouter)

  .use(handleError);

app.listen(port, async () => {
  await Promise.all([connectAdminDB(), connectUserDB()]);
  console.log(`server listening on port: ${port}`);
});
