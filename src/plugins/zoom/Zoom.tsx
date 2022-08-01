import * as React from "react";

import { Plugin } from "../../types.js";
import { createModule, MODULE_CONTROLLER, PLUGIN_ZOOM } from "../../core/index.js";
import { ZoomContextProvider } from "./ZoomContext.js";
import { ZoomButtonsGroup } from "./ZoomButtonsGroup.js";
import { ZoomWrapper } from "./ZoomWrapper.js";

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

/** Zoom plugin */
export const Zoom: Plugin = ({ augment, append }) => {
    augment(({ toolbar: { buttons, ...restToolbar }, render, carousel, animation, zoom, ...restProps }) => ({
        toolbar: {
            buttons: [<ZoomButtonsGroup key={PLUGIN_ZOOM} labels={restProps.labels} render={render} />, ...buttons],
            ...restToolbar,
        },
        render: {
            ...render,
            slide: (slide, offset, rect) => (
                <ZoomWrapper
                    slide={slide}
                    offset={offset}
                    rect={rect}
                    render={render}
                    carousel={carousel}
                    animation={animation}
                    zoom={zoom}
                />
            ),
        },
        zoom: {
            ...defaultZoomProps,
            ...zoom,
        },
        carousel,
        animation,
        ...restProps,
    }));

    append(MODULE_CONTROLLER, createModule(PLUGIN_ZOOM, ZoomContextProvider));
};
