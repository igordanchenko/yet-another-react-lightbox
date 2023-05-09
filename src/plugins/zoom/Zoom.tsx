import * as React from "react";

import { addToolbarButton, createModule, isImageSlide, Plugin, PLUGIN_ZOOM } from "../../index.js";
import { resolveZoomProps } from "./props.js";
import { ZoomContextProvider } from "./ZoomController.js";
import { ZoomToolbarControl } from "./ZoomToolbarControl.js";
import { ZoomWrapper } from "./ZoomWrapper.js";

/** Zoom plugin */
export const Zoom: Plugin = ({ augment, addModule }) => {
    augment(({ toolbar, render, zoom, ...restProps }) => ({
        zoom: resolveZoomProps(zoom),
        toolbar: addToolbarButton(toolbar, PLUGIN_ZOOM, <ZoomToolbarControl />),
        render: {
            ...render,
            slide: (props) =>
                isImageSlide(props.slide) ? <ZoomWrapper render={render} {...props} /> : render.slide?.(props),
        },
        ...restProps,
    }));

    addModule(createModule(PLUGIN_ZOOM, ZoomContextProvider));
};
