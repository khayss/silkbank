import { ComponentProps } from "react";

const CustomButton = ({ ...rest }: ComponentProps<"input">) => {
  return (
    <input
      className="w-full bg-blue-800 h-12 text-xl text-white rounded-lg my-3 cursor-pointer hover:bg-blue-600"
      {...rest}
    />
  );
};

export default CustomButton;
