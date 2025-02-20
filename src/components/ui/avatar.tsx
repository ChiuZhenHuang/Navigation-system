import { Avatar as AntdAvatar, AvatarProps } from "antd";
import { forwardRef } from "react";
import { cn } from "../../utils/cn";

interface Props extends AvatarProps {
  className?: string;
  children?: React.ReactNode;
}

const Avatar = forwardRef<HTMLButtonElement, Props>(
  ({ className, children, ...props }: Props, ref) => {
    return (
      <AntdAvatar ref={ref} className={cn(className)} {...props}>
        {children}
      </AntdAvatar>
    );
  }
);

export default Avatar;
