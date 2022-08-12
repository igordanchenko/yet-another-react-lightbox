import * as React from "react";

import { Plugin } from "../../types.js";
import { SlideshowButton } from "./SlideshowButton.js";
import { PLUGIN_SLIDESHOW } from "../../core/index.js";

export const defaultSlideshowProps = {
    autoplay: false,
    delay: 3000,
};

/** Slideshow plugin */
export const Slideshow: Plugin = ({ augment }) => {
    augment(({ slideshow: originalSlideshow, toolbar: { buttons, ...restToolbar }, ...restProps }) => ({
        toolbar: {
            buttons: [<SlideshowButton key={PLUGIN_SLIDESHOW} />, ...buttons],
            ...restToolbar,
        },
        slideshow: {
            ...defaultSlideshowProps,
            ...originalSlideshow,
        },
        ...restProps,
    }));
};
