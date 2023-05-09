import { composePrefix, PLUGIN_THUMBNAILS } from "../../index.js";

export const cssPrefix = (value?: string) => composePrefix(PLUGIN_THUMBNAILS, value);

export const cssThumbnailPrefix = (value?: string) => cssPrefix(composePrefix("thumbnail", value));
