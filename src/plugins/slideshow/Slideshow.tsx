import * as React from "react";

import { Plugin } from "../../types.js";
import { SlideshowButton } from "./SlideshowButton.js";

export const defaultSlideshowProps = {
    autoplay: false,
    delay: 3000,
};

/** Slideshow plugin */
export const Slideshow: Plugin = ({ augment }) => {
    augment(({ slideshow: originalSlideshow, toolbar: { buttons, ...restToolbar }, ...restProps }) => ({
        toolbar: {
            buttons: [<SlideshowButton key="slideshow" />, ...buttons],
            ...restToolbar,
        },
        slideshow: {
            ...defaultSlideshowProps,
            ...originalSlideshow,
        },
        ...restProps,
    }));
};
