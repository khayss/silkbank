import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./modules/pages/landingPage";
import GeneralError from "./modules/pages/error";
import Signup from "./modules/auth/pages/signup";
import Dashboard from "./modules/pages/dashboard";
import Login from "./modules/auth/pages/login";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "*", element: <GeneralError /> },
]);
