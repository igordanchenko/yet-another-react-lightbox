import { LightboxProps } from "../../index.js";

export const defaultZoomProps = {
    maxZoomPixelRatio: 1,
    zoomInMultiplier: 2,
    doubleTapDelay: 300,
    doubleClickDelay: 500,
    doubleClickMaxStops: 2,
    keyboardMoveDistance: 50,
    wheelZoomDistanceFactor: 100,
    pinchZoomDistanceFactor: 100,
    scrollToZoom: false,
};

export const resolveZoomProps = (zoom: LightboxProps["zoom"]) => ({
    ...defaultZoomProps,
    ...zoom,
});
