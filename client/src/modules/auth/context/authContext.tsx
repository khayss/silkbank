import { ReactNode, createContext } from "react";
import { UserData } from "../types/currentuser.types";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

export const AuthContext = createContext<UserData>({ success: false });

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useGetCurrentUser();

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
