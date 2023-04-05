import * as React from "react";

import { PluginProps } from "../../types.js";
import { addToolbarButton, PLUGIN_DOWNLOAD } from "../../core/index.js";
import { DownloadButton } from "./DownloadButton.js";

export function Download({ augment }: PluginProps) {
    augment(({ toolbar, ...restProps }) => ({
        toolbar: addToolbarButton(toolbar, PLUGIN_DOWNLOAD, <DownloadButton />),
        ...restProps,
    }));
}
