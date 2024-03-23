import { useEffect, useState } from "react";
import { getCurrentUserApi } from "../api/userApi";
import { CurrentUser, UserData } from "../types/currentuser.types";

const useGetCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<UserData>({ success: false });
  useEffect(() => {
    const controller = new AbortController();
    const getUser = async () => {
      const response = await getCurrentUserApi();
      if (response) {
        if (typeof response === "string") {
          setCurrentUser({ success: false });
        } else {
          if (response.data) {
            if ("data" in response.data) {
              const user = response.data.data as CurrentUser;
              setCurrentUser({ success: true, user });
            } else {
              setCurrentUser({ success: false });
            }
          } else {
            setCurrentUser({ success: false });
          }
        }
      } else {
        setCurrentUser({ success: false });
      }
    };
    getUser();
    return () => {
      controller.abort();
    };
  }, []);

  return { currentUser };
};

export default useGetCurrentUser;
