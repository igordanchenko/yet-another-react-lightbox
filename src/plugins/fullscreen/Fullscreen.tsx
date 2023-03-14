import * as React from "react";

import { Plugin } from "../../types.js";
import { createModule, MODULE_CONTROLLER, PLUGIN_FULLSCREEN, PLUGIN_THUMBNAILS } from "../../core/index.js";
import { defaultFullscreenProps } from "./props.js";
import { FullscreenButton } from "./FullscreenButton.js";
import { FullscreenContextProvider } from "./FullscreenContext.js";

/** Fullscreen plugin */
export const Fullscreen: Plugin = ({ augment, contains, addParent }) => {
    augment(({ fullscreen, toolbar: { buttons, ...restToolbar }, ...restProps }) => ({
        toolbar: { buttons: [<FullscreenButton key={PLUGIN_FULLSCREEN} />, ...buttons], ...restToolbar },
        fullscreen: { ...defaultFullscreenProps, ...fullscreen },
        ...restProps,
    }));

    addParent(
        contains(PLUGIN_THUMBNAILS) ? PLUGIN_THUMBNAILS : MODULE_CONTROLLER,
        createModule(PLUGIN_FULLSCREEN, FullscreenContextProvider)
    );
};
