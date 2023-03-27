import * as React from "react";

import { PluginProps } from "../../types.js";
import { createModule, MODULE_CONTROLLER, PLUGIN_FULLSCREEN, PLUGIN_THUMBNAILS } from "../../core/index.js";
import { resolveThumbnailsProps } from "./props.js";
import { ThumbnailsContextProvider } from "./ThumbnailsContext.js";
import { ThumbnailsButton } from "./ThumbnailsButton.js";

/** Thumbnails plugin */
export function Thumbnails({ augment, contains, append, addParent }: PluginProps) {
    augment(({ thumbnails: thumbnailsProps, toolbar: { buttons, ...restToolbar }, ...restProps }) => {
        const thumbnails = resolveThumbnailsProps(thumbnailsProps);
        return {
            toolbar: {
                buttons: [...(thumbnails.showToggle ? [<ThumbnailsButton key={PLUGIN_THUMBNAILS} />] : []), ...buttons],
                ...restToolbar,
            },
            thumbnails,
            ...restProps,
        };
    });

    const module = createModule(PLUGIN_THUMBNAILS, ThumbnailsContextProvider);
    if (contains(PLUGIN_FULLSCREEN)) {
        append(PLUGIN_FULLSCREEN, module);
    } else {
        addParent(MODULE_CONTROLLER, module);
    }
}
