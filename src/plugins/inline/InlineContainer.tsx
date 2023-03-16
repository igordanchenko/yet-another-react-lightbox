import * as React from "react";

import { ComponentProps } from "../../types.js";
import { clsx, cssClass } from "../../core/index.js";

/** Inline plugin container */
export function InlineContainer({ inline: { className, ...rest } = {}, children }: ComponentProps) {
    return (
        <div className={clsx(cssClass("root"), cssClass("relative"), className)} {...rest}>
            {children}
        </div>
    );
}
