import { LightboxProps } from "./types.js";

export const LightboxDefaultProps: LightboxProps = {
    open: false,
    close: () => {},
    index: 0,
    slides: [],
    render: {},
    plugins: [],
    toolbar: { buttons: ["close"] },
    labels: {},
    animation: {
        fade: 330,
        swipe: 500,
    },
    carousel: {
        finite: false,
        preload: 2,
        padding: "16px",
        spacing: "30%",
        imageFit: "contain",
    },
    controller: {
        focus: true,
        aria: false,
        touchAction: "none",
        closeOnBackdropClick: false,
    },
    on: {},
    styles: {},
    className: "",
};
