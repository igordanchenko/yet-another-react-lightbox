import * as React from "react";

import { addToolbarButton, PLUGIN_DOWNLOAD, PluginProps } from "../../index.js";
import { resolveDownloadProps } from "./props.js";
import { DownloadButton } from "./DownloadButton.js";

export function Download({ augment }: PluginProps) {
  augment(({ toolbar, download, ...restProps }) => ({
    toolbar: addToolbarButton(toolbar, PLUGIN_DOWNLOAD, <DownloadButton />),
    download: resolveDownloadProps(download),
    ...restProps,
  }));
}
