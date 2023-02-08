import * as React from "react";

import { LightboxProps } from "../../types.js";
import { Zoom } from "./Zoom.js";

export const ACTION_ZOOM_IN = "zoom-in";
export const ACTION_ZOOM_OUT = "zoom-out";

/** Custom zoom button render function */
type RenderZoomButton = ({
    ref,
    labels,
    disabled,
    onClick,
    onFocus,
    onBlur,
}: Pick<LightboxProps, "labels"> & {
    ref: React.ForwardedRef<HTMLButtonElement>;
    disabled: boolean;
    onClick: () => void;
    onFocus: () => void;
    onBlur: () => void;
}) => React.ReactNode;

declare module "../../types" {
    interface LightboxProps {
        /** Zoom plugin settings */
        zoom?: {
            /** ratio of image pixels to physical pixels at maximum zoom level */
            maxZoomPixelRatio?: number;
            /** zoom-in multiplier */
            zoomInMultiplier?: number;
            /** double-tap maximum time delay */
            doubleTapDelay?: number;
            /** double-click maximum time delay */
            doubleClickDelay?: number;
            /** maximum number of zoom-in stops via double-click or double-tap */
            doubleClickMaxStops?: number;
            /** keyboard move distance */
            keyboardMoveDistance?: number;
            /** wheel zoom distance factor */
            wheelZoomDistanceFactor?: number;
            /** pinch zoom distance factor */
            pinchZoomDistanceFactor?: number;
            /** if `true`, enables image zoom via scroll gestures for mouse and trackpad users */
            scrollToZoom?: boolean;
        };
    }

    // noinspection JSUnusedGlobalSymbols
    interface AnimationSettings {
        /** zoom animation duration */
        zoom?: number;
    }

    interface Render {
        /** render custom Zoom in button */
        buttonZoomIn?: RenderZoomButton;
        /** render custom Zoom in button */
        buttonZoomOut?: RenderZoomButton;
        /** render custom Zoom in icon */
        iconZoomIn?: () => React.ReactNode;
        /** render custom Zoom out icon */
        iconZoomOut?: () => React.ReactNode;
    }

    interface Callbacks {
        zoom?: (level: number) => void;
    }
}

export default Zoom;
