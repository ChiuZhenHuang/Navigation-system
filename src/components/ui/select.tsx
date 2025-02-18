import { Select as AntdSelect, SelectProps } from "antd";
import { forwardRef } from "react";
import type { BaseSelectRef } from "rc-select";

interface Props extends SelectProps {
  className?: string;
  children?: React.ReactNode;
}

const Select = forwardRef<BaseSelectRef, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <AntdSelect ref={ref} className={className} {...props}>
        {children}
      </AntdSelect>
    );
  }
);

Select.displayName = "CustomSelect";

export default Select;
