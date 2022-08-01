import * as React from "react";

import { Plugin } from "../../types.js";
import { createModule, MODULE_CONTROLLER, PLUGIN_FULLSCREEN, PLUGIN_THUMBNAILS } from "../../core/index.js";
import { FullscreenButton } from "./FullscreenButton.js";
import { FullscreenContextProvider } from "./FullscreenContext.js";

/** Fullscreen plugin */
export const Fullscreen: Plugin = ({ augment, contains, addParent }) => {
    augment(({ toolbar: { buttons, ...restToolbar }, ...restProps }) => ({
        toolbar: {
            buttons: [
                <FullscreenButton
                    key={PLUGIN_FULLSCREEN}
                    auto={Boolean(restProps.fullscreen)}
                    labels={restProps.labels}
                    render={restProps.render}
                />,
                ...buttons,
            ],
            ...restToolbar,
        },
        ...restProps,
    }));

    addParent(
        contains(PLUGIN_THUMBNAILS) ? PLUGIN_THUMBNAILS : MODULE_CONTROLLER,
        createModule(PLUGIN_FULLSCREEN, FullscreenContextProvider)
    );
};
