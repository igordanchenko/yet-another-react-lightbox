import * as React from "react";

import { Component } from "../../types.js";
import { clsx, cssClass } from "../../core/index.js";
import { cssPrefix } from "./utils.js";
import { ThumbnailsTrack } from "./ThumbnailsTrack.js";
import { defaultThumbnailsProps } from "./Thumbnails.js";

/** Thumbnails plugin component */
export const ThumbnailsComponent: Component = ({
    thumbnails: thumbnailsProps,
    slides,
    index,
    carousel,
    animation,
    render,
    styles,
    children,
}) => {
    const thumbnails = { ...defaultThumbnailsProps, ...thumbnailsProps };

    const ref = React.useRef<HTMLDivElement | null>(null);

    const track = (
        <ThumbnailsTrack
            container={ref}
            slides={slides}
            thumbnails={thumbnails}
            carousel={carousel}
            animation={animation}
            render={render}
            startingIndex={index}
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
};
