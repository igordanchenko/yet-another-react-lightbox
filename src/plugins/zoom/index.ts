import { Callback, RenderFunction, PLUGIN_ZOOM } from "../../index.js";
import { Zoom } from "./Zoom.js";

declare module "../../types.js" {
    interface LightboxProps {
        /** Zoom plugin settings */
        zoom?: {
            /** Zoom plugin ref */
            ref?: React.ForwardedRef<ZoomRef>;
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
        /** render custom Zoom control in the toolbar */
        buttonZoom?: RenderFunction<ZoomRef>;
        /** render custom Zoom In icon */
        iconZoomIn?: RenderFunction;
        /** render custom Zoom Out icon */
        iconZoomOut?: RenderFunction;
    }

    // noinspection JSUnusedGlobalSymbols
    interface RenderSlideProps {
        /** current zoom level */
        zoom?: number;
        /** maximum zoom level */
        maxZoom?: number;
    }

    // noinspection JSUnusedGlobalSymbols
    interface Callbacks {
        /** zoom callback */
        zoom?: Callback<ZoomCallbackProps>;
    }

    /** Zoom callback props */
    export interface ZoomCallbackProps {
        /** current zoom level */
        zoom: number;
    }

    // noinspection JSUnusedGlobalSymbols
    interface ToolbarButtonKeys {
        [PLUGIN_ZOOM]: null;
    }

    /** Zoom plugin ref */
    export interface ZoomRef {
        /** current zoom level */
        zoom: number;
        /** maximum zoom level */
        maxZoom: number;
        /** horizontal offset */
        offsetX: number;
        /** vertical offset */
        offsetY: number;
        /** if `true`, zoom is unavailable for the current slide */
        disabled: boolean;
        /** increase zoom level using `zoomInMultiplier` */
        zoomIn: Callback;
        /** decrease zoom level using `zoomInMultiplier` */
        zoomOut: Callback;
    }
}

export default Zoom;
