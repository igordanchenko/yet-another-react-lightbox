import * as React from "react";

import { PluginProps } from "../../types.js";
import { createModule, PLUGIN_CAPTIONS } from "../../core/index.js";
import { Title } from "./Title.js";
import { Description } from "./Description.js";
import { CaptionsButton } from "./CaptionsButton.js";
import { CaptionsContextProvider } from "./CaptionsContext.js";
import { resolveCaptionsProps } from "./props.js";

/** Captions plugin */
export function Captions({ augment, addModule }: PluginProps) {
    augment(
        ({
            render: { slideFooter: renderFooter, ...restRender },
            toolbar: { buttons, ...restToolbar },
            captions: captionsProps,
            ...restProps
        }) => {
            const captions = resolveCaptionsProps(captionsProps);
            return {
                render: {
                    slideFooter: ({ slide }) => (
                        <>
                            {renderFooter?.({ slide })}

                            {slide.title && <Title title={slide.title} />}

                            {slide.description && <Description description={slide.description} />}
                        </>
                    ),
                    ...restRender,
                },
                toolbar: {
                    buttons: [...(captions.showToggle ? [<CaptionsButton key={PLUGIN_CAPTIONS} />] : []), ...buttons],
                    ...restToolbar,
                },
                captions,
                ...restProps,
            };
        }
    );

    addModule(createModule(PLUGIN_CAPTIONS, CaptionsContextProvider));
}
