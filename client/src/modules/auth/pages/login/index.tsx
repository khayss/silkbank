import { FormEvent, useEffect, useReducer, useState } from "react";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { loginInputReducer } from "./utils/loginInputReducer";
import { loginInputSchema } from "./utils/validateLogin";
import useLoginUser from "../../hooks/useLoginUser";
import { useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};
const Login = () => {
  const [loginInput, dispatch] = useReducer(loginInputReducer, initialState);
  const [showResponse, setShowResponse] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const { loginUserResponse, loginUser } = useLoginUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(loginUserResponse);
    if (loginUserResponse?.success && "userToken" in loginUserResponse) {
      localStorage.setItem(
        "userToken",
        JSON.stringify(loginUserResponse.userToken)
      );
      const successTimeout = setTimeout(() => {
        setShowResponse(false);
        dispatch({ type: "RESET" });
        navigate("/dashboard");
      }, 2000);
      return () => clearTimeout(successTimeout);
    } else {
      const errorTimeout = setTimeout(() => {
        setShowResponse(false);
      }, 10000);
      return () => clearTimeout(errorTimeout);
    }
  }, [loginUserResponse, navigate]);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsSubmit(true);
    e.preventDefault();
    setShowResponse(true);
    try {
      const validatedLoginInput = loginInputSchema.safeParse(loginInput);
      if (validatedLoginInput.success) {
        await loginUser(validatedLoginInput.data);
      } else {
        if (validatedLoginInput.error) {
          console.log(validatedLoginInput.error.issues[0].message);
        } else {
          throw new Error("invalid input");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmit(false);
    }
  };
  return (
    <div className="pt-10 container flex items-center justify-center">
      <form
        className="w-4/5 bg-slate-200 rounded-md px-8 pt-6 pb-5"
        onSubmit={handleFormSubmit}
      >
        <h1 className="font-bold text-2xl text-center my-2 text-blue-800">
          Login
        </h1>
        {showResponse && loginUserResponse ? (
          <h1
            className={`font-medium text-xl text-center mt-4 ${
              loginUserResponse.success ? "text-green-700" : "text-red-700"
            }`}
          >
            {loginUserResponse.message}
          </h1>
        ) : (
          ""
        )}
        <CustomInput
          labelText="Email"
          labelfor="login-email"
          type="email"
          id="login-email"
          value={loginInput.email}
          onChange={(e) =>
            dispatch({ payload: e.target.value.toLowerCase(), type: "EMAIL" })
          }
        />
        <CustomInput
          labelText="Password"
          labelfor="login-password"
          type="password"
          id="login-password"
          value={loginInput.password}
          onChange={(e) =>
            dispatch({
              payload: e.target.value.toLowerCase(),
              type: "PASSWORD",
            })
          }
        />
        <CustomButton
          value={isSubmit ? "Logging in" : "Login"}
          type="submit"
          disabled={isSubmit}
          style={{ opacity: isSubmit ? 0.5 : 1 }}
        />
      </form>
    </div>
  );
};

export default Login;
