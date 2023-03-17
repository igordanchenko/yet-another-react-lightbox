import * as React from "react";

import { ComponentProps } from "../../types.js";
import { clsx, cssClass, LightboxPropsProvider } from "../../core/index.js";
import { cssPrefix } from "./utils.js";
import { ThumbnailsTrack } from "./ThumbnailsTrack.js";
import { resolveThumbnailsProps } from "./props.js";

/** Thumbnails plugin component */
export function ThumbnailsContainer({ children, ...props }: ComponentProps) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const { position } = resolveThumbnailsProps(props.thumbnails);

    return (
        <LightboxPropsProvider {...props}>
            <div ref={containerRef} className={clsx(cssClass(cssPrefix()), cssClass(cssPrefix(`${position}`)))}>
                {["start", "top"].includes(position) && <ThumbnailsTrack containerRef={containerRef} />}
                <div className={cssClass(cssPrefix("wrapper"))}>{children}</div>
                {["end", "bottom"].includes(position) && <ThumbnailsTrack containerRef={containerRef} />}
            </div>
        </LightboxPropsProvider>
    );
}
