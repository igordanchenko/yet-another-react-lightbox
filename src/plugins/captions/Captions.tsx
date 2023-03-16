import * as React from "react";

import { PluginProps } from "../../types.js";
import { createModule, MODULE_CONTROLLER, PLUGIN_CAPTIONS } from "../../core/index.js";
import { resolveCaptionsProps } from "./props.js";
import { CaptionsContextProvider } from "./CaptionsContext.js";
import { Description } from "./Description.js";
import { Title } from "./Title.js";

/** Captions plugin */
export function Captions({ augment, addParent }: PluginProps) {
    addParent(MODULE_CONTROLLER, createModule(PLUGIN_CAPTIONS, CaptionsContextProvider));

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
