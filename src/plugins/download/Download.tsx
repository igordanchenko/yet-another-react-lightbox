import * as React from "react";

import { addToolbarButton, PLUGIN_DOWNLOAD, PluginProps } from "../../index.js";
import { DownloadButton } from "./DownloadButton.js";

export function Download({ augment }: PluginProps) {
    augment(({ toolbar, ...restProps }) => ({
        toolbar: addToolbarButton(toolbar, PLUGIN_DOWNLOAD, <DownloadButton />),
        ...restProps,
    }));
}
