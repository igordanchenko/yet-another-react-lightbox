import * as React from "react";

import { addToolbarButton, createModule, MODULE_CONTROLLER, PLUGIN_ROTATE, PluginProps } from "../../index.js";
import { RotateButton } from "./RotateButton.js";
import { RotateContextProvider } from "./RotateContext.js";

/** Rotate plugin */
export function Rotate({ augment, addParent }: PluginProps) {
  augment(({ toolbar, ...restProps }) => ({
    toolbar: addToolbarButton(toolbar, PLUGIN_ROTATE, <RotateButton />),
    ...restProps,
  }));

  addParent(MODULE_CONTROLLER, createModule(PLUGIN_ROTATE, RotateContextProvider));
}
