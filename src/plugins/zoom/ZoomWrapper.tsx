import * as React from "react";

import { ImageSlide, isImageSlide, useEventCallback } from "../../core/index.js";
import { ZoomContainer } from "./ZoomContainer.js";
import { useZoom } from "./ZoomContext.js";

/** Zoom slide wrapper */
export const ZoomWrapper: typeof ZoomContainer = ({ slide, offset, rect, render, carousel, animation, zoom }) => {
    const { setIsZoomSupported, isZoomSupported } = useZoom();

    const zoomSupported = isImageSlide(slide) && (Boolean(slide.srcSet) || Boolean(slide.width && slide.height));

    const updateIsZoomSupported = useEventCallback(() => {
        if (offset === 0 && zoomSupported !== isZoomSupported) {
            setIsZoomSupported(zoomSupported);
        }
    });

    React.useEffect(updateIsZoomSupported, [offset, updateIsZoomSupported]);

    if (zoomSupported) {
        return (
            <ZoomContainer
                slide={slide}
                offset={offset}
                rect={rect}
                render={render}
                carousel={carousel}
                animation={animation}
                zoom={zoom}
            />
        );
    }

    const rendered = render.slide?.(slide, offset, rect);
    if (rendered) {
        return <>{rendered}</>;
    }

    if (isImageSlide(slide)) {
        return <ImageSlide slide={slide} offset={offset} rect={rect} render={render} imageFit={carousel.imageFit} />;
    }

    return null;
};
