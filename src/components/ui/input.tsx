import { Input as AntdInput, InputProps, InputRef } from "antd";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface Props extends InputProps {
  className?: string;
  children?: React.ReactNode;
}

const Input = forwardRef<InputRef, Props>(
  ({ className, children, ...props }: Props, ref) => {
    return (
      <AntdInput ref={ref} className={cn(className)} {...props}>
        {children}
      </AntdInput>
    );
  }
);

const CustomInput = Object.assign(Input, AntdInput) as typeof AntdInput;

export default CustomInput;
