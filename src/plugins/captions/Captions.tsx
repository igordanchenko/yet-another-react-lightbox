import * as React from "react";

import { PluginProps } from "../../types.js";
import { resolveCaptionsProps } from "./props.js";
import { Description } from "./Description.js";
import { Title } from "./Title.js";

/** Captions plugin */
export function Captions({ augment }: PluginProps) {
    augment(({ render: { slideFooter: renderFooter, ...restRender }, captions, styles, ...restProps }) => {
        return {
            render: {
                slideFooter: ({ slide }) => (
                    <>
                        {renderFooter?.({ slide })}

                        {slide.title && <Title styles={styles} title={slide.title} />}

                        {slide.description && <Description styles={styles} description={slide.description} />}
                    </>
                ),
                ...restRender,
            },
            captions: resolveCaptionsProps(captions),
            styles,
            ...restProps,
        };
    });
}
