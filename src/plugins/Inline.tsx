import * as React from "react";

import { Component, Plugin } from "../types.js";
import { createModule } from "../core/index.js";

declare module "../types.js" {
    interface LightboxProps {
        /** HTML div element attributes to be passed to the inline plugin container */
        inline?: React.HTMLAttributes<HTMLDivElement>;
    }
}

/** Inline plugin container */
export const InlineContainer: Component = ({ inline, children }) => <div {...inline}>{children}</div>;

/** Inline plugin module */
export const InlineModule = createModule("inline", InlineContainer);

/** Inline plugin */
export const Inline: Plugin = ({ augment, replace, remove }) => {
    augment(
        ({
            toolbar: { buttons, ...restToolbar },
            open,
            close,
            controller: { focus, ...restController },
            ...restProps
        }) => ({
            open: true,
            close: () => {},
            toolbar: {
                buttons: buttons.filter((button) => button !== "close"),
                ...restToolbar,
            },
            inline: { style: { width: "100%", height: "100%" } },
            controller: { focus: false, ...restController },
            ...restProps,
        })
    );

    remove("no-scroll");
    replace("portal", InlineModule);
};

export default Inline;
