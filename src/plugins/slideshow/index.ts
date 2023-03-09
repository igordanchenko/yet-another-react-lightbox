import { RenderFunction } from "../../types.js";
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

    /** `render.buttonSlideshow` render function props */
    export type RenderSlideshowButtonProps = {
        /** current slideshow autoplay status */
        playing: boolean;
        /** toggle slideshow autoplay status */
        togglePlaying: () => void;
        /** if `true`, the button is disabled */
        disabled: boolean;
    };

    interface Render {
        /** render custom Slideshow Play icon */
        iconSlideshowPlay?: RenderFunction;
        /** render custom Slideshow Pause icon */
        iconSlideshowPause?: RenderFunction;
        /** render custom Slideshow button */
        buttonSlideshow?: RenderFunction<RenderSlideshowButtonProps>;
    }
}

export default Slideshow;
