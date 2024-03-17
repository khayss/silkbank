import { useReducer } from "react";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { initialState, stateReducer } from "./utils/stateReducer";

const Signup = () => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  return (
    <div className="pt-32 container flex items-center justify-center">
      <form
        action=""
        className="w-1/2"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <CustomInput
          labelFor="firstname"
          labelText="Firstname"
          type="text"
          name="firstname"
          value={state.firstname}
          onChange={(e) =>
            dispatch({ type: "FIRSTNAME", payload: e.target.value })
          }
        />
        <CustomInput
          labelFor="lastname"
          labelText="Lastname"
          type="text"
          name="lastname"
          value={state.lastname}
          onChange={(e) =>
            dispatch({ type: "LASTNAME", payload: e.target.value })
          }
        />
        <CustomInput
          labelFor="Email"
          labelText="email"
          type="email"
          name="email"
          value={state.email}
          onChange={(e) => dispatch({ type: "EMAIL", payload: e.target.value })}
        />
        <CustomInput
          labelFor="address"
          labelText="Address"
          type="text"
          name="address"
          value={state.address}
          onChange={(e) =>
            dispatch({ type: "ADDRESS", payload: e.target.value })
          }
        />
        <CustomInput
          labelFor="tel"
          labelText="Phone number"
          type="text"
          name="tel"
          value={state.tel}
          onChange={(e) => dispatch({ type: "TEL", payload: e.target.value })}
        />
        <CustomInput
          labelFor="password"
          labelText="Password"
          type="text"
          name="password"
          value={state.password}
          onChange={(e) =>
            dispatch({ type: "PASSWORD", payload: e.target.value })
          }
        />
        <CustomButton value="Create account" type="submit" />
      </form>
    </div>
  );
};

export default Signup;
