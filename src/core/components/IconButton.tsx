import * as React from "react";

import { clsx, cssClass } from "../utils.js";
import { useController } from "../modules/Controller.js";

export type IconButtonProps = Omit<
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    "type" | "aria-label"
> & {
    label: string;
    icon: React.ElementType;
    renderIcon?: () => React.ReactNode;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ label, className, icon: Icon, renderIcon, onClick, style, ...rest }, ref) => {
        const {
            latestProps: {
                current: { styles },
            },
        } = useController();

        return (
            <button
                ref={ref}
                type="button"
                aria-label={label}
                className={clsx(cssClass("button"), className)}
                onClick={onClick}
                style={{ ...style, ...styles.button }}
                {...rest}
            >
                {renderIcon ? renderIcon() : <Icon className={cssClass("icon")} style={styles.icon} />}
            </button>
        );
    }
);
IconButton.displayName = "IconButton";
