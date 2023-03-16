import * as React from "react";

import { PluginProps } from "../../types.js";
import { createModule, MODULE_CONTROLLER, PLUGIN_SLIDESHOW } from "../../core/index.js";
import { resolveSlideshowProps } from "./props.js";
import { SlideshowContextProvider } from "./SlideshowContext.js";
import { SlideshowButton } from "./SlideshowButton.js";

/** Slideshow plugin */
export function Slideshow({ augment, append }: PluginProps) {
    augment(({ slideshow, toolbar: { buttons, ...restToolbar }, ...restProps }) => ({
        toolbar: { buttons: [<SlideshowButton key={PLUGIN_SLIDESHOW} />, ...buttons], ...restToolbar },
        slideshow: resolveSlideshowProps(slideshow),
        ...restProps,
    }));

    append(MODULE_CONTROLLER, createModule(PLUGIN_SLIDESHOW, SlideshowContextProvider));
}
