import * as React from "react";

import {
  devicePixelRatio,
  ImageSlide,
  ImageSlideProps,
  ImageSource,
  isImageFitCover,
  SlideImage,
  UNKNOWN_ACTION_TYPE,
  useEventCallback,
  useLayoutEffect,
} from "../../index.js";

export type ResponsiveImageSlide = Omit<SlideImage, "srcSet"> & {
  srcSet: [ImageSource, ...ImageSource[]];
};

export function isResponsiveImageSlide(slide: SlideImage): slide is ResponsiveImageSlide {
  return (slide.srcSet?.length || 0) > 0;
}

export type ResponsiveImageProps = Omit<ImageSlideProps, "slide" | "rect"> &
  Required<Pick<ImageSlideProps, "rect">> & {
    slide: ResponsiveImageSlide;
    interactive: boolean;
  };

type ResponsiveImageState = {
  current?: string;
  preload?: string;
};

type ResponsiveImageStateAction = {
  type: "fetch" | "done";
  source: string;
};

function reducer(
  { current, preload }: ResponsiveImageState,
  { type, source }: ResponsiveImageStateAction,
): ResponsiveImageState {
  switch (type) {
    case "fetch":
      if (!current) {
        return { current: source };
      }
      return { current, preload: source };
    case "done":
      if (source === preload) {
        return { current: source };
      }
      return { current, preload };
    default:
      throw new Error(UNKNOWN_ACTION_TYPE);
  }
}

export function ResponsiveImage(props: ResponsiveImageProps) {
  const [{ current, preload }, dispatch] = React.useReducer(reducer, {});

  const { slide: image, rect, imageFit, render, interactive } = props;

  const srcSet = image.srcSet.sort((a, b) => a.width - b.width);
  const width = image.width ?? srcSet[srcSet.length - 1].width;
  const height = image.height ?? srcSet[srcSet.length - 1].height;
  const cover = isImageFitCover(image, imageFit);
  const maxWidth = Math.max(...srcSet.map((x) => x.width));
  const targetWidth = Math.min((cover ? Math.max : Math.min)(rect.width, width * (rect.height / height)), maxWidth);
  const pixelDensity = devicePixelRatio();

  const handleResize = useEventCallback(() => {
    const targetSource = srcSet.find((x) => x.width >= targetWidth * pixelDensity) ?? srcSet[srcSet.length - 1];

    if (!current || srcSet.findIndex((x) => x.src === current) < srcSet.findIndex((x) => x === targetSource)) {
      dispatch({ type: "fetch", source: targetSource.src });
    }
  });

  useLayoutEffect(handleResize, [rect.width, rect.height, pixelDensity, handleResize]);

  const handlePreload = useEventCallback((currentPreload: string) =>
    dispatch({ type: "done", source: currentPreload }),
  );

  const style = {
    // workaround occasional flickering in mobile Safari
    WebkitTransform: !interactive ? "translateZ(0)" : "initial",
  };

  if (!cover) {
    Object.assign(
      style,
      rect.width / rect.height < width / height ? { width: "100%", height: "auto" } : { width: "auto", height: "100%" },
    );
  }

  return (
    <>
      {preload && preload !== current && (
        <ImageSlide
          key="preload"
          {...props}
          // do not publish active slide status events
          offset={undefined}
          slide={{ ...image, src: preload, srcSet: undefined }}
          style={{ position: "absolute", visibility: "hidden", ...style }}
          onLoad={() => handlePreload(preload)}
          render={{
            ...render,
            iconLoading: () => null,
            iconError: () => null,
          }}
        />
      )}

      {current && (
        <ImageSlide key="current" {...props} slide={{ ...image, src: current, srcSet: undefined }} style={style} />
      )}
    </>
  );
}
