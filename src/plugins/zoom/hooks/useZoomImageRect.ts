import {
  ContainerRect,
  isImageFitCover,
  isImageSlide,
  round,
  Slide,
  useLightboxProps,
  useLightboxState,
} from "../../../index.js";
import { defaultZoomProps } from "../props.js";
import { useZoomProps } from "./useZoomProps.js";

function resolveMaxZoom(maxZoom: number | ((slide: Slide) => number | undefined), slide: Slide) {
  const resolved = typeof maxZoom === "function" ? (maxZoom(slide) ?? defaultZoomProps.maxZoom) : maxZoom;
  return Math.max(resolved, 1);
}

export function useZoomImageRect(slideRect: ContainerRect, imageDimensions?: ContainerRect) {
  let imageRect: ContainerRect = { width: 0, height: 0 };
  let maxImageRect: ContainerRect = { width: 0, height: 0 };

  const { currentSlide } = useLightboxState();
  const { imageFit } = useLightboxProps().carousel;
  const { maxZoomPixelRatio, maxZoom: maxZoomInProps } = useZoomProps();

  if (slideRect && currentSlide) {
    const slide = { ...currentSlide, ...imageDimensions };
    if (isImageSlide(slide)) {
      const cover = isImageFitCover(slide, imageFit);

      const width = Math.max(...(slide.srcSet?.map((x) => x.width) || []).concat(slide.width ? [slide.width] : []));

      const height = Math.max(...(slide.srcSet?.map((x) => x.height) || []).concat(slide.height ? [slide.height] : []));

      if (width > 0 && height > 0 && slideRect.width > 0 && slideRect.height > 0) {
        maxImageRect = cover
          ? {
              width: Math.round(Math.min(width, (slideRect.width / slideRect.height) * height)),
              height: Math.round(Math.min(height, (slideRect.height / slideRect.width) * width)),
            }
          : { width, height };

        maxImageRect = {
          width: maxImageRect.width * maxZoomPixelRatio,
          height: maxImageRect.height * maxZoomPixelRatio,
        };

        imageRect = cover
          ? {
              width: Math.min(slideRect.width, maxImageRect.width, width),
              height: Math.min(slideRect.height, maxImageRect.height, height),
            }
          : {
              width: Math.round(Math.min(slideRect.width, (slideRect.height / height) * width, width)),
              height: Math.round(Math.min(slideRect.height, (slideRect.width / width) * height, height)),
            };
      }
    } else if (slideRect.width > 0 && slideRect.height > 0) {
      if (imageDimensions && imageDimensions.width > 0 && imageDimensions.height > 0) {
        imageRect = {
          width: Math.min(slideRect.width, imageDimensions.width),
          height: Math.min(slideRect.height, imageDimensions.height),
        };
      } else {
        imageRect = { width: slideRect.width, height: slideRect.height };
      }
    }
  }

  const maxZoom =
    currentSlide && imageRect.width
      ? isImageSlide(currentSlide)
        ? Math.max(round(maxImageRect.width / imageRect.width, 5), 1)
        : resolveMaxZoom(maxZoomInProps, currentSlide)
      : 1;

  return { imageRect, maxZoom };
}
