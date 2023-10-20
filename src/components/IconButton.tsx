import * as React from "react";

import { clsx, cssClass, label as translateLabel } from "../utils.js";
import { useLightboxProps } from "../contexts/index.js";
import { ELEMENT_BUTTON, ELEMENT_ICON } from "../consts.js";

export type IconButtonProps = Omit<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "type" | "aria-label"
> & {
  label: string;
  icon: React.ElementType;
  renderIcon?: () => React.ReactNode;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, className, icon: Icon, renderIcon, onClick, style, ...rest },
  ref,
) {
  const { styles, labels } = useLightboxProps();

  return (
    <button
      ref={ref}
      type="button"
      aria-label={translateLabel(labels, label)}
      className={clsx(cssClass(ELEMENT_BUTTON), className)}
      onClick={onClick}
      style={{ ...style, ...styles.button }}
      {...rest}
    >
      {renderIcon ? renderIcon() : <Icon className={cssClass(ELEMENT_ICON)} style={styles.icon} />}
    </button>
  );
});
