import * as React from "react";

import { Component, Plugin } from "../../types.js";
import {
    ACTION_CLOSE,
    clsx,
    createModule,
    cssClass,
    MODULE_NO_SCROLL,
    MODULE_PORTAL,
    PLUGIN_INLINE,
} from "../../core/index.js";

/** Inline plugin container */
const InlineContainer: Component = ({ inline: { className, ...rest } = {}, children }) => (
    <div className={clsx(cssClass("root"), cssClass("relative"), className)} {...rest}>
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
                buttons: buttons.filter((button) => button !== ACTION_CLOSE),
                ...restToolbar,
            },
            inline: { style: { width: "100%", height: "100%" }, className },
            controller: { focus: false, aria: true, touchAction: "pan-y", ...restController },
            className,
            ...restProps,
        })
    );

    remove(MODULE_NO_SCROLL);
    replace(MODULE_PORTAL, createModule(PLUGIN_INLINE, InlineContainer));
};
