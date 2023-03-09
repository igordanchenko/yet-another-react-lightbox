import * as React from "react";

import { RenderFunction } from "../../types.js";
import { Zoom } from "./Zoom.js";

export const ACTION_ZOOM_IN = "zoom-in";
export const ACTION_ZOOM_OUT = "zoom-out";

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

    /** `render.buttonZoomIn` and `render.buttonZoomOut` render function props */
    export type RenderZoomButtonProps = Pick<LightboxProps, "labels"> & {
        ref: React.ForwardedRef<HTMLButtonElement>;
        disabled: boolean;
        onClick: () => void;
        onFocus: () => void;
        onBlur: () => void;
    };

    interface Render {
        /** render custom Zoom in button */
        buttonZoomIn?: RenderFunction<RenderZoomButtonProps>;
        /** render custom Zoom in button */
        buttonZoomOut?: RenderFunction<RenderZoomButtonProps>;
        /** render custom Zoom in icon */
        iconZoomIn?: RenderFunction;
        /** render custom Zoom out icon */
        iconZoomOut?: RenderFunction;
    }

    // noinspection JSUnusedGlobalSymbols
    interface Callbacks {
        zoom?: (level: number) => void;
    }
}

declare module "../../core" {
    // noinspection JSUnusedGlobalSymbols
    interface EventTypes {
        [ACTION_ZOOM_IN]: void;
        [ACTION_ZOOM_OUT]: void;
    }
}

export default Zoom;
