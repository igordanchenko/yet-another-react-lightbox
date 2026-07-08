import { composePrefix, PLUGIN_FILMSTRIP } from "../../index.js";

export const cssFilmstripPrefix = (value?: string) => composePrefix(PLUGIN_FILMSTRIP, value);

export const cssFilmstripThumbnailPrefix = (value?: string) =>
  composePrefix(PLUGIN_FILMSTRIP, composePrefix("thumbnail", value));
