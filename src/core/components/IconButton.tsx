import * as React from "react";

import { clsx, cssClass } from "../utils.js";

export type IconButtonProps = Omit<
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    "type" | "aria-label"
> & {
    label: string;
    icon: React.ElementType;
    renderIcon?: () => React.ReactNode;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ label, className, icon: Icon, renderIcon, onClick, ...rest }, ref) => (
        <button
            ref={ref}
            type="button"
            aria-label={label}
            className={clsx(cssClass("button"), className)}
            onClick={onClick}
            {...rest}
        >
            {renderIcon ? renderIcon() : <Icon className={cssClass("icon")} />}
        </button>
    )
);
IconButton.displayName = "IconButton";
