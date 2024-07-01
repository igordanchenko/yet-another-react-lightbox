import * as React from "react";

import {
  CLASS_FLEX_CENTER,
  CLASS_FULLSIZE,
  CLASS_SLIDE_WRAPPER,
  CLASS_SLIDE_WRAPPER_INTERACTIVE,
  clsx,
  ContainerRect,
  cssClass,
  ImageSlide,
  isImageSlide,
  LightboxProps,
  RenderSlideProps,
  useLayoutEffect,
  useLightboxProps,
  useLightboxState,
} from "../../index.js";
import { useZoom } from "./ZoomController.js";
import { isResponsiveImageSlide, ResponsiveImage } from "./ResponsiveImage.js";

// using the non-augmented `render` here
export type ZoomWrapperProps = Pick<LightboxProps, "render"> & RenderSlideProps;

/** Zoom wrapper */
export function ZoomWrapper({ render, slide, offset, rect }: ZoomWrapperProps) {
  const [imageDimensions, setImageDimensions] = React.useState<ContainerRect>();
  const zoomWrapperRef = React.useRef<HTMLDivElement>(null);

  const { zoom, maxZoom, offsetX, offsetY, setZoomWrapper } = useZoom();
  const interactive = zoom > 1;

  const { carousel, on } = useLightboxProps();
  const { currentIndex } = useLightboxState();

  useLayoutEffect(() => {
    if (offset === 0) {
      setZoomWrapper({ zoomWrapperRef, imageDimensions });
      return () => setZoomWrapper(undefined);
    }
    return () => {};
  }, [offset, imageDimensions, setZoomWrapper]);

  let rendered = render.slide?.({ slide, offset, rect, zoom, maxZoom });

  if (!rendered && isImageSlide(slide)) {
    const slideProps = {
      slide,
      offset,
      rect,
      render,
      imageFit: carousel.imageFit,
      imageProps: carousel.imageProps,
      onClick: offset === 0 ? () => on.click?.({ index: currentIndex }) : undefined,
    };

    rendered = isResponsiveImageSlide(slide) ? (
      <ResponsiveImage
        {...slideProps}
        slide={slide}
        interactive={interactive}
        rect={offset === 0 ? { width: rect.width * zoom, height: rect.height * zoom } : rect}
      />
    ) : (
      <ImageSlide
        onLoad={(img) => setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })}
        {...slideProps}
      />
    );
  }

  if (!rendered) return null;

  return (
    <div
      ref={zoomWrapperRef}
      className={clsx(
        cssClass(CLASS_FULLSIZE),
        cssClass(CLASS_FLEX_CENTER),
        cssClass(CLASS_SLIDE_WRAPPER),
        interactive && cssClass(CLASS_SLIDE_WRAPPER_INTERACTIVE),
      )}
      style={
        offset === 0 ? { transform: `scale(${zoom}) translateX(${offsetX}px) translateY(${offsetY}px)` } : undefined
      }
    >
      {rendered}
    </div>
  );
}
