import { LightboxProps } from "./types.js";
import { ACTION_CLOSE, IMAGE_FIT_CONTAIN } from "./core/consts.js";

export const AnimationDefaultProps = {
    fade: 330,
    swipe: 500,
};

export const LightboxDefaultProps: LightboxProps = {
    open: false,
    close: () => {},
    index: 0,
    slides: [],
    render: {},
    plugins: [],
    toolbar: { buttons: [ACTION_CLOSE] },
    labels: {},
    animation: AnimationDefaultProps,
    carousel: {
        finite: false,
        preload: 2,
        padding: "16px",
        spacing: "30%",
        imageFit: IMAGE_FIT_CONTAIN,
    },
    controller: {
        ref: null,
        focus: true,
        aria: false,
        touchAction: "none",
        closeOnBackdropClick: false,
    },
    on: {},
    styles: {},
    className: "",
};
