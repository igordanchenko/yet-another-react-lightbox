import { Callback, ContainerRect, ImageFit, RenderFunction, Slide } from "../../types.js";
import { Thumbnails } from "./Thumbnails.js";

type Position = "top" | "bottom" | "start" | "end";

declare module "../../types.js" {
    interface LightboxProps {
        /** Thumbnails plugin settings */
        thumbnails?: {
            /** Thumbnails plugin ref */
            ref?: React.ForwardedRef<ThumbnailsRef>;
            /** thumbnails position */
            position?: Position;
            /** thumbnail width */
            width?: number;
            /** thumbnail height */
            height?: number;
            /** thumbnail border width */
            border?: number;
            /** thumbnail border radius */
            borderRadius?: number;
            /** thumbnail inner padding */
            padding?: number;
            /** gap between thumbnails */
            gap?: number;
            /** `object-fit` setting */
            imageFit?: ImageFit;
            /** if `true`, show the vignette effect on the edges of the thumbnails track */
            vignette?: boolean;
            /** if `true`, show the Toggle Thumbnails button in the toolbar */
            showToggle?: boolean;
        };
    }

    interface Render {
        /** render custom thumbnail */
        thumbnail?: RenderFunction<RenderThumbnailProps>;
        /** render custom Thumbnails Visible icon */
        iconThumbnailsVisible?: RenderFunction;
        /** render custom Thumbnails Hidden icon */
        iconThumbnailsHidden?: RenderFunction;
        /** render custom Thumbnails button */
        buttonThumbnails?: RenderFunction<ThumbnailsRef>;
    }

    /** `render.thumbnail` render function props */
    export type RenderThumbnailProps = {
        slide: Slide;
        rect: ContainerRect;
        render: Render;
        imageFit: ImageFit;
    };

    // noinspection JSUnusedGlobalSymbols
    interface SlotType {
        /** thumbnail customization slot */
        thumbnail: "thumbnail";
        /** thumbnails track customization slot */
        thumbnailsTrack: "thumbnailsTrack";
        /** thumbnails container customization slot */
        thumbnailsContainer: "thumbnailsContainer";
    }

    /** Thumbnails plugin ref */
    export interface ThumbnailsRef {
        /** if `true`, thumbnails are visible */
        visible: boolean;
        /** show thumbnails */
        show: Callback;
        /** hide thuumbnails */
        hide: Callback;
    }
}

export default Thumbnails;
