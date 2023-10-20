import * as React from "react";

import {
  addToolbarButton,
  createModule,
  MODULE_CONTROLLER,
  PLUGIN_FULLSCREEN,
  PLUGIN_THUMBNAILS,
  PluginProps,
} from "../../index.js";
import { resolveThumbnailsProps } from "./props.js";
import { ThumbnailsContextProvider } from "./ThumbnailsContext.js";
import { ThumbnailsButton } from "./ThumbnailsButton.js";

/** Thumbnails plugin */
export function Thumbnails({ augment, contains, append, addParent }: PluginProps) {
  augment(({ thumbnails: thumbnailsProps, toolbar, ...restProps }) => {
    const thumbnails = resolveThumbnailsProps(thumbnailsProps);
    return {
      toolbar: addToolbarButton(toolbar, PLUGIN_THUMBNAILS, thumbnails.showToggle ? <ThumbnailsButton /> : null),
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
