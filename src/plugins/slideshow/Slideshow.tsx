import * as React from "react";

import { Plugin } from "../../types.js";
import { createModule, MODULE_CONTROLLER, PLUGIN_SLIDESHOW } from "../../core/index.js";
import { defaultSlideshowProps } from "./props.js";
import { SlideshowContextProvider } from "./SlideshowContext.js";
import { SlideshowButton } from "./SlideshowButton.js";

/** Slideshow plugin */
export const Slideshow: Plugin = ({ augment, append }) => {
    augment(({ slideshow, toolbar: { buttons, ...restToolbar }, ...restProps }) => ({
        toolbar: { buttons: [<SlideshowButton key={PLUGIN_SLIDESHOW} />, ...buttons], ...restToolbar },
        slideshow: { ...defaultSlideshowProps, ...slideshow },
        ...restProps,
    }));

    append(MODULE_CONTROLLER, createModule(PLUGIN_SLIDESHOW, SlideshowContextProvider));
};
