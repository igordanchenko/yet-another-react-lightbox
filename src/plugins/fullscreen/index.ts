import * as React from "react";

import { Fullscreen } from "./Fullscreen.js";

declare module "../../types" {
    interface LightboxProps {
        /** if `true`, enter fullscreen mode automatically when the lightbox opens */
        fullscreen?: boolean;
    }

    interface Render {
        /** render custom Enter/Exit Fullscreen button */
        buttonFullscreen?: ({
            fullscreen,
            toggleFullscreen,
        }: {
            fullscreen: boolean;
            toggleFullscreen: () => void;
        }) => React.ReactNode;
        /** render custom Enter Fullscreen icon */
        iconEnterFullscreen?: () => React.ReactNode;
        /** render custom Exit Fullscreen icon */
        iconExitFullscreen?: () => React.ReactNode;
    }
}

declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Document {
        webkitFullscreenEnabled?: boolean;
        mozFullScreenEnabled?: boolean;
        msFullscreenEnabled?: boolean;

        webkitExitFullscreen?: () => void;
        mozCancelFullScreen?: () => void;
        msExitFullscreen?: () => void;

        webkitFullscreenElement?: Element;
        mozFullScreenElement?: Element;
        msFullscreenElement?: Element;
    }

    // noinspection JSUnusedGlobalSymbols
    interface HTMLElement {
        webkitRequestFullscreen?: () => void;
        mozRequestFullScreen?: () => void;
        msRequestFullscreen?: () => void;
    }
}

export default Fullscreen;
