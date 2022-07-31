import * as React from "react";

import { Component, Plugin } from "../types.js";
import { clsx, createModule, cssClass } from "../core/index.js";

declare module "../types.js" {
    interface LightboxProps {
        /** HTML div element attributes to be passed to the Inline plugin container */
        inline?: React.HTMLAttributes<HTMLDivElement>;
    }
}

/** Inline plugin container */
export const InlineContainer: Component = ({ inline: { className, ...rest } = {}, children }) => (
    <div className={clsx(cssClass("root"), className)} {...rest}>
        {children}
    </div>
);

/** Inline plugin module */
export const InlineModule = createModule("inline", InlineContainer);

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
    replace("portal", InlineModule);
};

// noinspection JSUnusedGlobalSymbols
export default Inline;
