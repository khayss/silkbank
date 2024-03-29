import "dotenv/config";
import express from "express";
import { userRouter } from "./routes/userRoutes";
import { connectUserDB } from "./databases/UserDB";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import morgan from "morgan";
import { handleError } from "./middlewares/handleError";
import { connectAdminDB } from "./databases/AdminDB";
import { adminRouter } from "./routes/adminRoutes";
import cors from "cors";

const app = express();
const port = Number(process.env.PORT) || 8080;
app
  .use(cors({origin: "http://localhost:5173", credentials: true}))
  .use(morgan("dev"))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cookieParser())
  .use(methodOverride("method_"))

  .use(process.env.USER_API_VERSION!, userRouter)
  .use(process.env.ADMIN_API_VERSION!, adminRouter)

  .use(handleError);

app.listen(port, async () => {
  await Promise.all([connectAdminDB(), connectUserDB()]);
  console.log(`server listening on port: ${port}`);
});
