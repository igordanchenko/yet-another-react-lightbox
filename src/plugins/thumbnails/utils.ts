import { composePrefix } from "../../core/utils.js";
import { PLUGIN_THUMBNAILS } from "../../core/consts.js";

export const cssPrefix = (value?: string) => composePrefix(PLUGIN_THUMBNAILS, value);

export const cssThumbnailPrefix = (value?: string) => cssPrefix(composePrefix("thumbnail", value));
