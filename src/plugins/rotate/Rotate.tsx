import * as React from "react";

import { addToolbarButton, createModule, PLUGIN_ROTATE, PluginProps } from "../../index.js";
import { resolveRotateProps } from "./props.js";
import { RotateContextProvider } from "./RotateContext.js";
import { RotateToolbarControl } from "./RotateToolbarControl.js";

/** Rotate plugin */
export function Rotate({ augment, addParent }: PluginProps) {
  augment(({ rotate, toolbar, ...restProps }) => ({
    rotate: resolveRotateProps(rotate),
    toolbar: addToolbarButton(toolbar, PLUGIN_ROTATE, <RotateToolbarControl />),
    ...restProps,
  }));

  // mount at the root, so that every module sees the same rotation regardless of plugin order
  addParent("", createModule(PLUGIN_ROTATE, RotateContextProvider));
}
