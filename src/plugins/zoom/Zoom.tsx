import * as React from "react";

import { Plugin } from "../../types.js";
import { createModule, isImageSlide, PLUGIN_ZOOM } from "../../core/index.js";
import { resolveZoomProps } from "./props.js";
import { ZoomContextProvider } from "./ZoomController.js";
import { ZoomToolbarControl } from "./ZoomToolbarControl.js";
import { ZoomWrapper } from "./ZoomWrapper.js";

/** Zoom plugin */
export const Zoom: Plugin = ({ augment, addModule }) => {
    augment(({ toolbar: { buttons, ...restToolbar }, render, zoom, ...restProps }) => ({
        zoom: resolveZoomProps(zoom),
        toolbar: { buttons: [<ZoomToolbarControl key={PLUGIN_ZOOM} />, ...buttons], ...restToolbar },
        render: {
            ...render,
            slide: (props) =>
                isImageSlide(props.slide) ? <ZoomWrapper render={render} {...props} /> : render.slide?.(props),
        },
        ...restProps,
    }));

    addModule(createModule(PLUGIN_ZOOM, ZoomContextProvider));
};
