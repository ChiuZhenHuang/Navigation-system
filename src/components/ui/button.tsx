import { Button as AntdButton, ButtonProps } from "antd";
import { forwardRef } from "react";
import { cn } from "../../utils/cn";

interface Props extends ButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, children, ...props }: Props, ref) => {
    return (
      <AntdButton
        ref={ref}
        className={cn(className)}
        shape="round"
        {...props}
        block
      >
        {children}
      </AntdButton>
    );
  }
);

export default Button;
