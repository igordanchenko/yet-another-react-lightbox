import * as React from "react";

import { clsx, ComponentProps, cssClass } from "../../index.js";

/** Inline plugin container */
export function InlineContainer({ inline: { className, ...rest } = {}, children }: ComponentProps) {
    return (
        <div className={clsx(cssClass("root"), cssClass("relative"), className)} {...rest}>
            {children}
        </div>
    );
}
