import { ComponentProps } from "react";

type Props = {
  labelText: string;
  labelFor: string;
} & ComponentProps<"input">;

const CustomInput = ({ labelText, ...rest }: Props) => {
  return (
    <div className="flex flex-col w-full items-start justify-center my-2">
      <label className="text-lg font-medium">{labelText}</label>
      <input
        className="border-blue-600 border-2 w-full h-10 rounded-lg outline-none pl-3 text-lg"
        {...rest}
      />
    </div>
  );
};

export default CustomInput;
