import * as React from "react";

import { PluginProps, Slide, SlideVideo } from "../../index.js";
import { resolveVideoProps } from "./props.js";
import { VideoSlide } from "./VideoSlide.js";

function isVideoSlide(slide: Slide): slide is SlideVideo {
    return slide.type === "video";
}

/** Video plugin */
export function Video({ augment }: PluginProps) {
    augment(({ render: { slide: renderSlide, ...restRender }, video, ...restProps }) => ({
        render: {
            slide: ({ slide, offset, rect }) => {
                if (isVideoSlide(slide)) {
                    return (
                        <VideoSlide
                            key={slide.sources?.map((source) => source.src).join(" ")}
                            slide={slide}
                            offset={offset}
                        />
                    );
                }
                return renderSlide?.({ slide, offset, rect });
            },
            ...restRender,
        },
        video: resolveVideoProps(video),
        ...restProps,
    }));
}
