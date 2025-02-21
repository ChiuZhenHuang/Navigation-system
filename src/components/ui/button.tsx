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
        className={cn(
          "[&.ant-btn:hover]:bg-inherit", // 使用 !important 並指定具體的 antd class
          "[&.ant-btn]:!transition-colors",
          "[&.ant-btn]:duration-200",
          className,
          // 這會讓 hover 背景色跟隨你在 className 中設定的顏色
          `[&.ant-btn]:has-[.bg-orange-300]:hover:!bg-orange-200`
        )}
        shape="round"
        {...props}
      >
        {children}
      </AntdButton>
    );
  }
);

export default Button;
