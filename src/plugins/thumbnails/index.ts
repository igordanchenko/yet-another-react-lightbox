import { ContainerRect, ImageFit, RenderFunction, Slide } from "../../types.js";
import { Thumbnails } from "./Thumbnails.js";

type Position = "top" | "bottom" | "start" | "end";

declare module "../../types" {
    interface LightboxProps {
        /** Thumbnails plugin settings */
        thumbnails?: {
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
            /** vignette effect on the edges of the thumbnails track */
            vignette?: boolean;
        };
    }

    interface Render {
        /** render custom thumbnail */
        thumbnail?: RenderFunction<RenderThumbnailProps>;
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
}

export default Thumbnails;
