import { Tabs as AntdTabs, TabsProps } from "antd";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface Props extends TabsProps {
  className?: string;
}

const CustomTabs = forwardRef<HTMLDivElement, Props>(
  ({ className, children, ...props }: Props, ref) => {
    return (
      <div ref={ref}>
        <AntdTabs className={cn(className)} {...props} size="small">
          {children}
        </AntdTabs>
      </div>
    );
  }
);
CustomTabs.displayName = "CustomTabs";

export default CustomTabs;
