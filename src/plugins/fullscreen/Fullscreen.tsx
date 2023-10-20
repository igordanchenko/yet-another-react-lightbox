import * as React from "react";

import {
  addToolbarButton,
  createModule,
  MODULE_CONTROLLER,
  PLUGIN_FULLSCREEN,
  PLUGIN_THUMBNAILS,
  PluginProps,
} from "../../index.js";
import { resolveFullscreenProps } from "./props.js";
import { FullscreenButton } from "./FullscreenButton.js";
import { FullscreenContextProvider } from "./FullscreenContext.js";

/** Fullscreen plugin */
export function Fullscreen({ augment, contains, addParent }: PluginProps) {
  augment(({ fullscreen, toolbar, ...restProps }) => ({
    toolbar: addToolbarButton(toolbar, PLUGIN_FULLSCREEN, <FullscreenButton />),
    fullscreen: resolveFullscreenProps(fullscreen),
    ...restProps,
  }));

  addParent(
    contains(PLUGIN_THUMBNAILS) ? PLUGIN_THUMBNAILS : MODULE_CONTROLLER,
    createModule(PLUGIN_FULLSCREEN, FullscreenContextProvider),
  );
}
