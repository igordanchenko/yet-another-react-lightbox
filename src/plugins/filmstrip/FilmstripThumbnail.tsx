import * as React from "react";

import {
  CLASS_FLEX_CENTER,
  clsx,
  createIcon,
  cssClass,
  ELEMENT_ICON,
  ImageSlide,
  isImageSlide,
  makeComposePrefix,
  RenderThumbnailProps,
  Slide,
  translateSlideCounter,
  useEventCallback,
  useLightboxProps,
  useLightboxState,
} from "../../index.js";
import { cssFilmstripThumbnailPrefix } from "./utils.js";
import { useFilmstripProps } from "./props.js";

const VideoThumbnailIcon = createIcon(
  "VideoThumbnail",
  <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />,
);

const UnknownThumbnailIcon = createIcon(
  "UnknownThumbnail",
  <path d="M23 18V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zM8.5 12.5l2.5 3.01L14.5 11l4.5 6H5l3.5-4.5z" />,
);

type RenderArgs = RenderThumbnailProps & {
  imageLoading?: React.ImgHTMLAttributes<HTMLImageElement>["loading"];
};

function renderCell({ slide, render, rect, imageFit, imageLoading }: RenderArgs) {
  const customThumbnail = render.thumbnail?.({
    slide,
    render,
    rect,
    imageFit,
    imageLoading,
  } as RenderThumbnailProps);
  if (customThumbnail) {
    return customThumbnail;
  }

  const imageSlideProps = { render, rect, imageFit, loading: imageLoading };

  if (slide.thumbnail) {
    return <ImageSlide slide={{ src: slide.thumbnail }} {...imageSlideProps} />;
  }

  if (isImageSlide(slide)) {
    return <ImageSlide slide={slide} {...imageSlideProps} />;
  }

  const iconClass = cssClass(cssFilmstripThumbnailPrefix(ELEMENT_ICON));

  if (slide.type === "video") {
    return (
      <>
        {slide.poster && <ImageSlide slide={{ src: slide.poster }} {...imageSlideProps} />}

        <VideoThumbnailIcon className={iconClass} />
      </>
    );
  }

  return <UnknownThumbnailIcon className={iconClass} />;
}

const activePrefix = makeComposePrefix("active");

export type FilmstripThumbnailProps = {
  slide: Slide;
  index: number;
  /** Stable callback (e.g. `useEventCallback`); receives this cell's slide index. */
  onActivate: (index: number) => void;
  onLoseFocus: () => void;
  active?: boolean;
  imageLazy?: boolean;
};

type FilmstripThumbnailComponentProps = FilmstripThumbnailProps;

function FilmstripThumbnailInner({
  slide,
  index,
  onActivate,
  onLoseFocus,
  active: activeProp,
  imageLazy,
}: FilmstripThumbnailComponentProps) {
  const { render, styles, labels } = useLightboxProps();
  const { slides, globalIndex } = useLightboxState();
  const { width, height, imageFit } = useFilmstripProps();
  const rect = { width, height };
  const active = activeProp ?? index === globalIndex;
  const imageLoading = imageLazy ? ("lazy" as const) : undefined;

  const handleClick = useEventCallback(() => {
    onActivate(index);
  });

  const handleBlur = useEventCallback(() => {
    onLoseFocus();
  });

  return (
    <button
      type="button"
      className={clsx(
        cssClass(CLASS_FLEX_CENTER),
        cssClass(cssFilmstripThumbnailPrefix()),
        active && cssClass(cssFilmstripThumbnailPrefix(activePrefix())),
      )}
      style={styles.filmstripThumbnail}
      onClick={handleClick}
      onBlur={handleBlur}
      aria-current={active ? true : undefined}
      aria-label={translateSlideCounter(labels, slides, index)}
    >
      {renderCell({ slide, render, rect, imageFit, imageLoading })}
    </button>
  );
}

export const FilmstripThumbnail = React.memo(FilmstripThumbnailInner);
FilmstripThumbnail.displayName = "FilmstripThumbnail";
