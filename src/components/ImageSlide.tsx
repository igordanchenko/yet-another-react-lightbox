import * as React from "react";

import { CarouselSettings, ContainerRect, Render, SlideImage } from "../types.js";
import { clsx, cssClass, hasWindow, isImageFitCover, makeComposePrefix, normalizeRotation } from "../utils.js";
import { useEventCallback } from "../hooks/index.js";
import { useEvents, useTimeouts } from "../contexts/index.js";
import { ErrorIcon, LoadingIcon } from "./Icons.js";
import {
  activeSlideStatus,
  ELEMENT_ICON,
  SLIDE_STATUS_COMPLETE,
  SLIDE_STATUS_ERROR,
  SLIDE_STATUS_LOADING,
  SLIDE_STATUS_PLACEHOLDER,
  SlideStatus,
} from "../consts.js";

const slidePrefix = makeComposePrefix("slide");
const slideImagePrefix = makeComposePrefix("slide_image");

export type ImageSlideProps = Partial<Pick<CarouselSettings, "imageFit" | "imageProps">> & {
  slide: SlideImage;
  offset?: number;
  render?: Render;
  rect?: ContainerRect;
  /** clockwise rotation in degrees (multiples of 90) */
  rotation?: number;
  onClick?: () => void;
  onLoad?: (image: HTMLImageElement) => void;
  onError?: () => void;
  style?: React.CSSProperties;
};

export function ImageSlide({
  slide: image,
  offset,
  render,
  rect,
  rotation: rotationProp = 0,
  imageFit,
  imageProps,
  onClick,
  onLoad,
  onError,
  style,
}: ImageSlideProps) {
  const [status, setStatus] = React.useState<SlideStatus>(SLIDE_STATUS_LOADING);

  const { publish } = useEvents();
  const { setTimeout } = useTimeouts();

  const imageRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (offset === 0) {
      publish(activeSlideStatus(status));
    }
  }, [offset, status, publish]);

  const handleLoading = useEventCallback((img: HTMLImageElement) => {
    ("decode" in img ? img.decode() : Promise.resolve())
      .catch(() => {})
      .then(() => {
        if (!img.parentNode) {
          return;
        }
        setStatus(SLIDE_STATUS_COMPLETE);

        // this is a workaround for Zoom plugin's preload image swap
        // otherwise the 'complete' status does not get published
        setTimeout(() => {
          onLoad?.(img);
        }, 0);
      });
  });

  const setImageRef = React.useCallback(
    (img: HTMLImageElement | null) => {
      imageRef.current = img;

      if (img?.complete) {
        handleLoading(img);
      }
    },
    [handleLoading],
  );

  const handleOnLoad = React.useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      handleLoading(event.currentTarget);
    },
    [handleLoading],
  );

  const handleOnError = useEventCallback(() => {
    setStatus(SLIDE_STATUS_ERROR);

    onError?.();
  });

  const cover = isImageFitCover(image, imageFit);

  // quarter-turn rotations fit the image into the transposed slide rect
  const rotation = normalizeRotation(rotationProp);
  const rotated = rotation % 180 !== 0;
  // noinspection JSSuspiciousNameCombination
  const imageRect = rect && rotated ? { width: rect.height, height: rect.width } : rect;
  const widthLimit = rotated && imageRect ? `${imageRect.width}px` : "100%";
  const heightLimit = rotated && imageRect ? `${imageRect.height}px` : "100%";

  const nonInfinite = (value: number, fallback: number) => (Number.isFinite(value) ? value : fallback);

  const maxWidth = nonInfinite(
    Math.max(...(image.srcSet?.map((x) => x.width) ?? []).concat(image.width ? [image.width] : []).filter(Boolean)),
    imageRef.current?.naturalWidth || 0,
  );

  const maxHeight = nonInfinite(
    Math.max(...(image.srcSet?.map((x) => x.height) ?? []).concat(image.height ? [image.height] : []).filter(Boolean)),
    imageRef.current?.naturalHeight || 0,
  );

  const defaultStyle =
    maxWidth && maxHeight
      ? {
          maxWidth: `min(${maxWidth}px, ${widthLimit})`,
          maxHeight: `min(${maxHeight}px, ${heightLimit})`,
        }
      : {
          maxWidth: widthLimit,
          maxHeight: heightLimit,
        };

  // size rotated images explicitly, since the intrinsic size of a responsive image follows `sizes` only once the
  // matching source loads, so the image would shrink and then expand after the first rotation
  const fitScale =
    imageRect && maxWidth && maxHeight ? Math.min(imageRect.width / maxWidth, imageRect.height / maxHeight, 1) : 0;
  const rotatedSize =
    rotated && imageRect
      ? cover
        ? { width: imageRect.width, height: imageRect.height }
        : fitScale
          ? { width: maxWidth * fitScale, height: maxHeight * fitScale }
          : null
      : null;

  const srcSet = image.srcSet
    ?.slice()
    .sort((a, b) => a.width - b.width)
    .map((item) => `${item.src} ${item.width}w`)
    .join(", ");

  const estimateActualWidth = () =>
    imageRect && !cover && image.width && image.height
      ? (imageRect.height / image.height) * image.width
      : Number.MAX_VALUE;

  const sizes =
    srcSet && imageRect && hasWindow()
      ? `${Math.round(Math.min(estimateActualWidth(), imageRect.width))}px`
      : undefined;

  const {
    style: imagePropsStyle,
    className: imagePropsClassName,
    ...restImageProps
  } = (typeof imageProps === "function" ? imageProps(image) : imageProps) || {};

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
      <img
        ref={setImageRef}
        onLoad={handleOnLoad}
        onError={handleOnError}
        onClick={onClick}
        draggable={false}
        className={clsx(
          cssClass(slideImagePrefix()),
          cover && cssClass(slideImagePrefix("cover")),
          status !== SLIDE_STATUS_COMPLETE && cssClass(slideImagePrefix("loading")),
          imagePropsClassName,
        )}
        style={{
          ...defaultStyle,
          ...(rotation ? { rotate: `${rotation}deg` } : null),
          // transposed layout box may exceed the container, so prevent flex containers from shrinking it
          ...(rotated ? { flexShrink: 0 } : null),
          ...rotatedSize,
          ...style,
          ...imagePropsStyle,
        }}
        {...restImageProps}
        alt={image.alt ?? ""}
        sizes={sizes}
        srcSet={srcSet}
        src={image.src}
      />

      {status !== SLIDE_STATUS_COMPLETE && (
        <div className={cssClass(slidePrefix(SLIDE_STATUS_PLACEHOLDER))}>
          {status === SLIDE_STATUS_LOADING &&
            (render?.iconLoading ? (
              render.iconLoading()
            ) : (
              <LoadingIcon className={clsx(cssClass(ELEMENT_ICON), cssClass(slidePrefix(SLIDE_STATUS_LOADING)))} />
            ))}
          {status === SLIDE_STATUS_ERROR &&
            (render?.iconError ? (
              render.iconError()
            ) : (
              <ErrorIcon className={clsx(cssClass(ELEMENT_ICON), cssClass(slidePrefix(SLIDE_STATUS_ERROR)))} />
            ))}
        </div>
      )}
    </>
  );
}
