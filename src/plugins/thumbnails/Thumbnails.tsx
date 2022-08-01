import { Plugin } from "../../types.js";
import { createModule, MODULE_CONTROLLER, PLUGIN_FULLSCREEN, PLUGIN_THUMBNAILS } from "../../core/index.js";
import { ThumbnailsComponent } from "./ThumbnailsContainer.js";

export const defaultThumbnailsProps = {
    position: "bottom" as const,
    width: 120,
    height: 80,
    border: 1,
    borderRadius: 4,
    padding: 4,
    gap: 16,
    imageFit: "contain" as const,
};

/** Thumbnails plugin */
export const Thumbnails: Plugin = ({ augment, contains, append, addParent }) => {
    augment(({ thumbnails, ...restProps }) => ({
        thumbnails: {
            ...defaultThumbnailsProps,
            ...thumbnails,
        },
        ...restProps,
    }));

    const module = createModule(PLUGIN_THUMBNAILS, ThumbnailsComponent);
    if (contains(PLUGIN_FULLSCREEN)) {
        append(PLUGIN_FULLSCREEN, module);
    } else {
        addParent(MODULE_CONTROLLER, module);
    }
};
