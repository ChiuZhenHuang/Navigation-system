import { Card as AntdCard, CardProps } from "antd";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface Props extends CardProps {
  className?: string;
}

const CustomCard = forwardRef<HTMLDivElement, Props>(
  ({ className, children, ...props }: Props, ref) => {
    return (
      <AntdCard ref={ref} className={cn(className)} {...props} size="small">
        {children}
      </AntdCard>
    );
  }
);

CustomCard.displayName = "CustomCard";

export default CustomCard;
