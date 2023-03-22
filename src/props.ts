import { LightboxProps } from "./types.js";
import { ACTION_CLOSE, IMAGE_FIT_CONTAIN } from "./core/consts.js";

export const LightboxDefaultProps: LightboxProps = {
    open: false,
    close: () => {},
    index: 0,
    slides: [],
    render: {},
    plugins: [],
    toolbar: { buttons: [ACTION_CLOSE] },
    labels: {},
    animation: {
        fade: 250,
        swipe: 500,
        easing: {
            fade: "ease",
            swipe: "ease-out",
            navigation: "ease-in-out",
        },
    },
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
