import * as React from "react";

import { clsx, ComponentProps, cssClass } from "../../index.js";

/** Inline plugin container */
export function InlineContainer({ inline: { className, style, ...rest } = {}, styles, children }: ComponentProps) {
    return (
        <div
            className={clsx(cssClass("root"), cssClass("relative"), className)}
            style={{ ...styles.root, ...style }}
            {...rest}
        >
            {children}
        </div>
    );
}
