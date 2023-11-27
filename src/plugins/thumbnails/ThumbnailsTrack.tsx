import * as React from "react";

import {
  ACTION_NEXT,
  ACTION_PREV,
  ACTION_SWIPE,
  calculatePreload,
  CLASS_FLEX_CENTER,
  cleanup,
  clsx,
  cssClass,
  cssVar,
  getSlide,
  hasSlides,
  Slide,
  useAnimation,
  useEventCallback,
  useEvents,
  useKeyboardNavigation,
  useLightboxProps,
  useLightboxState,
  useRTL,
  useSensors,
} from "../../index.js";
import { cssPrefix, cssThumbnailPrefix } from "./utils.js";
import { Thumbnail } from "./Thumbnail.js";
import { defaultThumbnailsProps, useThumbnailsProps } from "./props.js";

function isHorizontal(position: ReturnType<typeof useThumbnailsProps>["position"]) {
  return ["top", "bottom"].includes(position);
}

function boxSize(thumbnails: ReturnType<typeof useThumbnailsProps>, dimension: number, includeGap?: boolean) {
  return dimension + 2 * (thumbnails.border + thumbnails.padding) + (includeGap ? thumbnails.gap : 0);
}

export type ThumbnailsTrackProps = {
  visible: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
};

export function ThumbnailsTrack({ visible, containerRef }: ThumbnailsTrackProps) {
  const track = React.useRef<HTMLDivElement>(null);

  const isRTL = useRTL();
  const { publish, subscribe } = useEvents();
  const { carousel, styles } = useLightboxProps();
  const { slides, globalIndex, animation } = useLightboxState();
  const { registerSensors, subscribeSensors } = useSensors();

  useKeyboardNavigation(subscribeSensors);

  const thumbnails = useThumbnailsProps();
  const { position, width, height, border, borderStyle, borderColor, borderRadius, padding, gap, vignette } =
    thumbnails;

  const index = globalIndex;
  const animationDuration = animation?.duration || 0;
  const offset = (animationDuration > 0 && animation?.increment) || 0;

  const { prepareAnimation } = useAnimation<number>(track, (snapshot) => ({
    keyframes: isHorizontal(position)
      ? [
          {
            transform: `translateX(${(isRTL ? -1 : 1) * boxSize(thumbnails, width, true) * offset + snapshot}px)`,
          },
          { transform: "translateX(0)" },
        ]
      : [
          {
            transform: `translateY(${boxSize(thumbnails, height, true) * offset + snapshot}px)`,
          },
          { transform: "translateY(0)" },
        ],
    duration: animationDuration,
    easing: animation?.easing,
  }));

  const handleControllerSwipe = useEventCallback(() => {
    let animationOffset = 0;
    if (containerRef.current && track.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const trackRect = track.current.getBoundingClientRect();
      animationOffset = isHorizontal(position)
        ? trackRect.left - containerRect.left - (containerRect.width - trackRect.width) / 2
        : trackRect.top - containerRect.top - (containerRect.height - trackRect.height) / 2;
    }

    prepareAnimation(animationOffset);
  });

  React.useEffect(() => cleanup(subscribe(ACTION_SWIPE, handleControllerSwipe)), [subscribe, handleControllerSwipe]);

  const preload = calculatePreload(carousel, slides);

  const items: { slide: Slide | null; index: number; placeholder?: boolean }[] = [];

  if (hasSlides(slides)) {
    if (offset < 0) {
      for (let i = index - preload + offset; i < index - preload; i += 1) {
        items.push({ slide: null, index: i, placeholder: true });
      }
    }

    for (let i = index - preload - Math.max(offset, 0); i < index; i += 1) {
      if (!(carousel.finite && i < 0)) {
        items.push({ slide: getSlide(slides, i), index: i });
      } else {
        items.push({ slide: null, index: i, placeholder: true });
      }
    }

    items.push({ slide: getSlide(slides, index), index });

    for (let i = index + 1; i <= index + preload - Math.min(offset, 0); i += 1) {
      if (!carousel.finite || i <= slides.length - 1) {
        items.push({ slide: getSlide(slides, i), index: i });
      } else {
        items.push({ slide: null, index: i, placeholder: true });
      }
    }

    if (offset > 0) {
      for (let i = index + preload + 1; i <= index + preload + offset; i += 1) {
        items.push({ slide: null, index: i, placeholder: true });
      }
    }
  }

  const handleClick = (slideIndex: number) => () => {
    if (slideIndex > index) {
      publish(ACTION_NEXT, { count: slideIndex - index });
    } else if (slideIndex < index) {
      publish(ACTION_PREV, { count: index - slideIndex });
    }
  };

  return (
    <div
      className={clsx(cssClass(cssPrefix("container")), cssClass(CLASS_FLEX_CENTER))}
      style={{
        ...(!visible ? { display: "none" } : null),
        ...(width !== defaultThumbnailsProps.width
          ? { [cssVar(cssThumbnailPrefix("width"))]: `${boxSize(thumbnails, width)}px` }
          : null),
        ...(height !== defaultThumbnailsProps.height
          ? { [cssVar(cssThumbnailPrefix("height"))]: `${boxSize(thumbnails, height)}px` }
          : null),
        ...(border !== defaultThumbnailsProps.border
          ? { [cssVar(cssThumbnailPrefix("border"))]: `${border}px` }
          : null),
        ...(borderStyle ? { [cssVar(cssThumbnailPrefix("border_style"))]: borderStyle } : null),
        ...(borderColor ? { [cssVar(cssThumbnailPrefix("border_color"))]: borderColor } : null),
        ...(borderRadius !== defaultThumbnailsProps.borderRadius
          ? { [cssVar(cssThumbnailPrefix("border_radius"))]: `${borderRadius}px` }
          : null),
        ...(padding !== defaultThumbnailsProps.padding
          ? { [cssVar(cssThumbnailPrefix("padding"))]: `${padding}px` }
          : null),
        ...(gap !== defaultThumbnailsProps.gap ? { [cssVar(cssThumbnailPrefix("gap"))]: `${gap}px` } : null),
        ...styles.thumbnailsContainer,
      }}
    >
      <nav
        ref={track}
        style={styles.thumbnailsTrack}
        className={clsx(cssClass(cssPrefix("track")), cssClass(CLASS_FLEX_CENTER))}
        tabIndex={-1}
        {...registerSensors}
      >
        {items.map(({ slide, index: slideIndex, placeholder }) => {
          const fadeAnimationDuration = animationDuration / Math.abs(offset || 1);

          const fadeIn =
            (offset > 0 && slideIndex > index + preload - offset && slideIndex <= index + preload) ||
            (offset < 0 && slideIndex < index - preload - offset && slideIndex >= index - preload)
              ? {
                  duration: fadeAnimationDuration,
                  delay:
                    ((offset > 0 ? slideIndex - (index + preload - offset) : index - preload - offset - slideIndex) -
                      1) *
                    fadeAnimationDuration,
                }
              : undefined;

          const fadeOut =
            (offset > 0 && slideIndex < index - preload) || (offset < 0 && slideIndex > index + preload)
              ? {
                  duration: fadeAnimationDuration,
                  delay:
                    (offset > 0
                      ? offset - (index - preload - slideIndex)
                      : -offset - (slideIndex - (index + preload))) * fadeAnimationDuration,
                }
              : undefined;

          return (
            <Thumbnail
              key={[`${slideIndex}`, placeholder && "placeholder"].filter(Boolean).join("-")}
              slide={slide}
              active={slideIndex === index}
              fadeIn={fadeIn}
              fadeOut={fadeOut}
              placeholder={Boolean(placeholder)}
              onClick={handleClick(slideIndex)}
              onLoseFocus={() => track.current?.focus()}
            />
          );
        })}
      </nav>
      {vignette && <div className={cssClass(cssPrefix("vignette"))} />}
    </div>
  );
}
