import { RenderFunction } from "../../types.js";
import { Fullscreen } from "./Fullscreen.js";

declare module "../../types" {
    interface LightboxProps {
        /** if `true`, enter fullscreen mode automatically when the lightbox opens */
        fullscreen?: boolean;
    }

    /** `render.buttonFullscreen` render function props */
    export type RenderFullscreenButtonProps = {
        fullscreen: boolean;
        fullscreenEnabled: boolean | undefined;
        toggleFullscreen: () => void;
    };

    interface Render {
        /** render custom Enter/Exit Fullscreen button */
        buttonFullscreen?: RenderFunction<RenderFullscreenButtonProps>;
        /** render custom Enter Fullscreen icon */
        iconEnterFullscreen?: RenderFunction;
        /** render custom Exit Fullscreen icon */
        iconExitFullscreen?: RenderFunction;
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
