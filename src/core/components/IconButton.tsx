import * as React from "react";

import { clsx, cssClass } from "../utils.js";

export type IconButtonProps = Omit<
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    "type" | "aria-label"
> & {
    label: string;
    icon: React.ElementType;
};

export const IconButton = ({ label, className, icon: Icon, onClick, ...rest }: IconButtonProps) => (
    <button
        type="button"
        aria-label={label}
        className={clsx(cssClass("button"), className)}
        onClick={onClick || undefined}
        {...rest}
    >
        <Icon className={cssClass("icon")} />
    </button>
);
