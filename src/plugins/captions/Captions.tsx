import * as React from "react";

import { Plugin } from "../../types.js";
import { createModule, MODULE_CONTROLLER, PLUGIN_CAPTIONS } from "../../core/index.js";
import { CaptionsContextProvider } from "./CaptionsContext.js";
import { Description } from "./Description.js";
import { Title } from "./Title.js";

export const defaultCaptionsProps = {
    descriptionTextAlign: "start" as const,
    descriptionMaxLines: 3,
};

/** Captions plugin */
export const Captions: Plugin = ({ augment, addParent }) => {
    addParent(MODULE_CONTROLLER, createModule(PLUGIN_CAPTIONS, CaptionsContextProvider));

    augment(({ render: { slideFooter: renderFooter, ...restRender }, captions, styles, ...restProps }) => ({
        render: {
            slideFooter: (slide) => (
                <>
                    {renderFooter?.(slide)}
                    {slide.title && <Title styles={styles} title={slide.title} />}
                    {slide.description && (
                        <Description
                            styles={styles}
                            description={slide.description}
                            {...{ ...defaultCaptionsProps, ...captions }}
                        />
                    )}
                </>
            ),
            ...restRender,
        },
        styles,
        ...restProps,
    }));
};
