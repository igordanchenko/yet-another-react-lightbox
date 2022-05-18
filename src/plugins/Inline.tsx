import * as React from "react";

import { Component, Plugin } from "../types.js";
import { createModule } from "../core/index.js";

declare module "../types.js" {
    interface LightboxProps {
        inline?: React.HTMLAttributes<HTMLDivElement>;
    }
}

export const InlineContainer: Component = ({ inline, children }) => <div {...inline}>{children}</div>;

export const InlineModule = createModule("inline", InlineContainer);

export const Inline: Plugin = ({ augment, replace, remove }) => {
    augment(({ toolbar: { buttons, ...restToolbar }, open, close, ...restProps }) => ({
        open: true,
        close: () => {},
        toolbar: {
            buttons: buttons.filter((button) => button !== "close"),
            ...restToolbar,
        },
        ...restProps,
    }));

    remove("no-scroll");
    replace("portal", InlineModule);
};
