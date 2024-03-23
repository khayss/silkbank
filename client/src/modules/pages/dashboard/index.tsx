// type Props = {};

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/context/authContext";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../auth/components/CustomButton";

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const [isUser, setIsUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authContext.success) {
      setIsUser(true);
    } else {
      navigate("/login");
    }

    return () => {};
  }, [authContext.success, navigate]);

  return (
    <div className="flex flex-col items-center justify-center">
      {isUser && authContext.success ? (
        <div>
          <div>
            <h1 className="text-center capitalize text-gray-800 font-medium text-2xl">
              Welcome {authContext.user.firstname}
            </h1>
          </div>
          <div>
            <h1 className="text-center font-bold text-3xl">
              N
              {parseFloat(authContext.user.balance).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="w-2/3">
              <CustomButton value="Send" />
              <CustomButton value="Receive" />
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Dashboard;
