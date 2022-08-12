import * as React from "react";

import { Slideshow } from "./Slideshow.js";

declare module "../../types" {
    interface LightboxProps {
        /** Slideshow plugin settings */
        slideshow?: {
            /** if `true`, slideshow is turned on automatically when the lightbox opens */
            autoplay?: boolean;
            /** slideshow delay in milliseconds */
            delay?: number;
        };
    }

    interface Render {
        /** render custom Slideshow Play icon */
        iconSlideshowPlay?: () => React.ReactNode;
        /** render custom Slideshow Pause icon */
        iconSlideshowPause?: () => React.ReactNode;
        /** render custom Slideshow button */
        buttonSlideshow?: ({
            playing,
            togglePlaying,
            disabled,
        }: {
            /** current slideshow autoplay status */
            playing: boolean;
            /** toggle slideshow autoplay status */
            togglePlaying: () => void;
            /** if `true`, the button is disabled */
            disabled: boolean;
        }) => React.ReactNode;
    }
}

export default Slideshow;
