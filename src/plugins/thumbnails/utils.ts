import { composePrefix, PLUGIN_THUMBNAILS } from "../../index.js";

export const cssPrefix = (value?: string) => composePrefix(PLUGIN_THUMBNAILS, value);

export const cssThumbnailPrefix = (value?: string) => cssPrefix(composePrefix("thumbnail", value));

export function calculateThumbnailsRange(
  globalIndex: number,
  preload: number,
  offset: number,
  totalSlides: number,
  finite: boolean,
) {
  let rangeStart = globalIndex - preload - Math.abs(offset);
  let rangeEnd = globalIndex + preload + Math.abs(offset);

  // For infinite carousels, prevent rendering more positions than unique slides
  if (!finite) {
    const totalPositions = rangeEnd - rangeStart + 1;
    if (totalPositions > totalSlides) {
      const reduction = totalPositions - totalSlides;
      rangeStart += Math.ceil(reduction / 2);
      rangeEnd -= Math.floor(reduction / 2);
    }
  }

  return { rangeStart, rangeEnd };
}
