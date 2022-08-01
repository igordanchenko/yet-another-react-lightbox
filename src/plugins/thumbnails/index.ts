import * as React from "react";

import { ImageFit, Slide } from "../../types.js";
import { ContainerRect } from "../../core/index.js";
import { Thumbnails } from "./Thumbnails.js";

export type Position = "top" | "bottom" | "start" | "end";

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
        };
    }

    interface Render {
        thumbnail?: ({
            slide,
            rect,
            render,
            imageFit,
        }: {
            slide: Slide;
            rect: ContainerRect;
            render: Render;
            imageFit: ImageFit;
        }) => React.ReactNode;
    }

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
