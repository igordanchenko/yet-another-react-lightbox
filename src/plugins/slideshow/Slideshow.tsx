import * as React from "react";

import { PluginProps } from "../../types.js";
import { addToolbarButton, createModule, PLUGIN_SLIDESHOW } from "../../core/index.js";
import { resolveSlideshowProps } from "./props.js";
import { SlideshowContextProvider } from "./SlideshowContext.js";
import { SlideshowButton } from "./SlideshowButton.js";

/** Slideshow plugin */
export function Slideshow({ augment, addModule }: PluginProps) {
    augment(({ slideshow, toolbar, ...restProps }) => ({
        toolbar: addToolbarButton(toolbar, PLUGIN_SLIDESHOW, <SlideshowButton />),
        slideshow: resolveSlideshowProps(slideshow),
        ...restProps,
    }));

    addModule(createModule(PLUGIN_SLIDESHOW, SlideshowContextProvider));
}
