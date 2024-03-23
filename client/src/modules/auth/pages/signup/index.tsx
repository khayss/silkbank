import { FormEvent, useEffect, useReducer, useState } from "react";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { initialState, stateReducer } from "./utils/signupReducer";
import useSignupUser from "../../hooks/useSignupUser";
import { FormInputSchema } from "./utils/validateFormInput";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const [isSubmit, setIsSubmit] = useState(false);
  const { signupUserResponse, signupUser } = useSignupUser();
  const [showResponse, setShowResponse] = useState(false);
  const navigate = useNavigate();

  const formSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    try {
      setShowResponse(false);
      setIsSubmit(true);
      e.preventDefault();
      const validatedFormBody = FormInputSchema.parse(state);
      await signupUser(validatedFormBody);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmit(false);
      setShowResponse(true);
    }
  };
  useEffect(() => {
    const responseTimeoutId = setTimeout(() => {
      if (signupUserResponse?.success) {
        dispatch({ type: "RESET" });
        navigate("/login");
      }
      setShowResponse(false);
    }, 10000);
    return () => {
      clearTimeout(responseTimeoutId);
    };
  }, [signupUserResponse, navigate]);

  return (
    <div className="pt-10 container flex items-center justify-center">
      <form
        action=""
        className="w-4/5 bg-slate-200 rounded-md px-8 pt-6 pb-5"
        onSubmit={formSubmitHandler}
      >
        <h1 className="font-bold text-2xl text-center my-2 text-blue-800">
          Signup
        </h1>
        {showResponse && signupUserResponse ? (
          <h1
            className={`font-medium text-xl text-center mt-4 ${
              signupUserResponse.success ? "text-green-700" : "text-red-700"
            }`}
          >
            {signupUserResponse.message}
          </h1>
        ) : (
          ""
        )}
        <CustomInput
          labelfor="firstname"
          labelText="Firstname"
          type="text"
          name="firstname"
          id="firstname"
          value={state.firstname}
          onChange={(e) =>
            dispatch({
              type: "FIRSTNAME",
              payload: e.target.value.toLowerCase(),
            })
          }
        />
        <CustomInput
          labelfor="lastname"
          labelText="Lastname"
          type="text"
          name="lastname"
          id="lastname"
          value={state.lastname}
          onChange={(e) =>
            dispatch({
              type: "LASTNAME",
              payload: e.target.value.toLowerCase(),
            })
          }
        />
        <CustomInput
          labelfor="email"
          labelText="Email"
          type="email"
          name="email"
          id="email"
          value={state.email}
          onChange={(e) =>
            dispatch({ type: "EMAIL", payload: e.target.value.toLowerCase() })
          }
        />
        <CustomInput
          labelfor="address"
          labelText="Address"
          type="text"
          name="address"
          id="address"
          value={state.address}
          onChange={(e) =>
            dispatch({ type: "ADDRESS", payload: e.target.value })
          }
        />
        <CustomInput
          labelfor="tel"
          labelText="Phone number"
          type="number"
          name="tel"
          id="tel"
          value={state.tel}
          onChange={(e) => dispatch({ type: "TEL", payload: e.target.value })}
        />
        <CustomInput
          labelfor="password"
          labelText="Password"
          type="text"
          name="password"
          id="password"
          value={state.password}
          onChange={(e) =>
            dispatch({ type: "PASSWORD", payload: e.target.value })
          }
        />
        <CustomButton
          value={isSubmit ? "Creating" : "Create account"}
          type="submit"
          disabled={isSubmit}
          style={{ opacity: isSubmit ? 0.5 : 1 }}
        />
      </form>
    </div>
  );
};

export default Signup;
