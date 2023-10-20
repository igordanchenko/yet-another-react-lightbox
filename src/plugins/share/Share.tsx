import * as React from "react";

import { addToolbarButton, PluginProps } from "../../index.js";
import { resolveShareProps } from "./props.js";
import { ShareButton } from "./ShareButton.js";

export function Share({ augment }: PluginProps) {
  augment(({ toolbar, share, ...rest }) => ({
    toolbar: addToolbarButton(toolbar, "share", <ShareButton />),
    share: resolveShareProps(share),
    ...rest,
  }));
}
