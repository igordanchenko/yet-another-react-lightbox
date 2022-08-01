import * as React from "react";

import { Plugin } from "../../types.js";
import { VideoSlide } from "./VideoSlide.js";

export const defaultVideoProps = {
    controls: true,
    playsInline: true,
};

/** Video plugin */
export const Video: Plugin = ({ augment }) => {
    augment(({ render: { slide: renderSlide, ...restRender }, video: originalVideo, ...restProps }) => ({
        render: {
            slide: (slide, offset, rect) => {
                if (slide.type === "video") {
                    return <VideoSlide slide={slide} offset={offset} />;
                }
                return renderSlide?.(slide, offset, rect);
            },
            ...restRender,
        },
        video: {
            ...defaultVideoProps,
            ...originalVideo,
        },
        ...restProps,
    }));
};
