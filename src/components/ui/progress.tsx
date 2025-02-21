import { Progress as AntdProgress, ProgressProps } from "antd";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface Props extends ProgressProps {
  className?: string;
}

const CustomProgress = forwardRef<HTMLDivElement, Props>(
  ({ className, children, ...props }: Props, ref) => {
    return (
      <AntdProgress ref={ref} className={cn(className)} {...props} size="small">
        {children}
      </AntdProgress>
    );
  }
);

CustomProgress.displayName = "CustomProgress";

export default CustomProgress;
