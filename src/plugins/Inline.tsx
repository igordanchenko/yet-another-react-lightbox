import * as React from "react";

import { Component, Plugin } from "../types.js";
import { createModule } from "../core/index.js";

declare module "../types.js" {
    interface LightboxProps {
        inline?: React.HTMLAttributes<HTMLDivElement>;
    }
}

const InlineContainer: Component = ({ inline, children }) => <div {...inline}>{children}</div>;

const InlineModule = createModule("inline", InlineContainer);

const Inline: Plugin = ({ augment, replace, remove }) => {
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

export { Inline, InlineModule, InlineContainer };
export default Inline;
