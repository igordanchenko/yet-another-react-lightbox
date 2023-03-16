import * as React from "react";

import { PluginProps } from "../../types.js";
import { resolveVideoProps } from "./props.js";
import { VideoSlide } from "./VideoSlide.js";

/** Video plugin */
export function Video({ augment }: PluginProps) {
    augment(({ render: { slide: renderSlide, ...restRender }, video, ...restProps }) => ({
        render: {
            slide: ({ slide, offset, rect }) => {
                if (slide.type === "video") {
                    return (
                        <VideoSlide
                            key={`${slide.sources.map((source) => source.src).join(" ")}`}
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
