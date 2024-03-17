import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./modules/pages/landingPage";
import GeneralError from "./modules/pages/error";
import Signup from "./modules/auth/pages/signup";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "*", element: <GeneralError /> },
  { path: "signup", element: <Signup /> },
]);
