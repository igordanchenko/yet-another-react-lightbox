import * as React from "react";

import { ComponentProps } from "../../types.js";
import { clsx, cssClass } from "../../core/index.js";
import { cssPrefix } from "./utils.js";
import { ThumbnailsTrack } from "./ThumbnailsTrack.js";
import { resolveThumbnailsProps } from "./props.js";

/** Thumbnails plugin component */
export function ThumbnailsComponent({
    thumbnails: thumbnailsProps,
    carousel,
    animation,
    render,
    styles,
    children,
}: ComponentProps) {
    const thumbnails = resolveThumbnailsProps(thumbnailsProps);

    const ref = React.useRef<HTMLDivElement | null>(null);

    const track = (
        <ThumbnailsTrack
            container={ref}
            thumbnails={thumbnails}
            carousel={carousel}
            animation={animation}
            render={render}
            thumbnailRect={{ width: thumbnails.width, height: thumbnails.height }}
            styles={styles}
        />
    );

    return (
        <div ref={ref} className={clsx(cssClass(cssPrefix()), cssClass(cssPrefix(`${thumbnails.position}`)))}>
            {(thumbnails.position === "start" || thumbnails.position === "top") && track}
            <div className={cssClass(cssPrefix("wrapper"))}>{children}</div>
            {(thumbnails.position === "end" || thumbnails.position === "bottom") && track}
        </div>
    );
}
