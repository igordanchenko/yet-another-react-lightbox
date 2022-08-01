import * as React from "react";

import { Component, Plugin } from "../../types.js";
import { clsx, createModule, cssClass } from "../../core/index.js";

/** Inline plugin container */
const InlineContainer: Component = ({ inline: { className, ...rest } = {}, children }) => (
    <div className={clsx(cssClass("root"), className)} {...rest}>
        {children}
    </div>
);

/** Inline plugin */
export const Inline: Plugin = ({ augment, replace, remove }) => {
    augment(
        ({
            toolbar: { buttons, ...restToolbar },
            open,
            close,
            controller: { focus, aria, touchAction, ...restController },
            className,
            ...restProps
        }) => ({
            open: true,
            close: () => {},
            toolbar: {
                buttons: buttons.filter((button) => button !== "close"),
                ...restToolbar,
            },
            inline: { style: { width: "100%", height: "100%" }, className },
            controller: { focus: false, aria: true, touchAction: "pan-y", ...restController },
            className,
            ...restProps,
        })
    );

    remove("no-scroll");
    replace("portal", createModule("inline", InlineContainer));
};
