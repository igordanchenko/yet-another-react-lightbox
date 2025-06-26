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
  getSlideIndex,
  getSlideKey,
  hasSlides,
  Slide,
  translateLabel,
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

function boxSize(thumbnails: ReturnType<typeof useThumbnailsProps>, dimension: number) {
  return dimension + 2 * (thumbnails.border + thumbnails.padding) + thumbnails.gap;
}

function getThumbnailKey(slide?: Slide | null) {
  const { thumbnail, poster } = (slide as {
    thumbnail?: unknown;
    poster?: unknown;
  }) || { thumbnail: "placeholder" };

  return (
    (typeof thumbnail === "string" && thumbnail) ||
    (typeof poster === "string" && poster) ||
    (slide && getSlideKey(slide)) ||
    undefined
  );
}

export type ThumbnailsTrackProps = {
  visible: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export function ThumbnailsTrack({ visible, containerRef }: ThumbnailsTrackProps) {
  const track = React.useRef<HTMLDivElement>(null);

  const isRTL = useRTL();
  const { publish, subscribe } = useEvents();
  const { carousel, styles, labels } = useLightboxProps();
  const { slides, globalIndex, animation } = useLightboxState();
  const { registerSensors, subscribeSensors } = useSensors();

  useKeyboardNavigation(subscribeSensors);

  const thumbnails = useThumbnailsProps();
  const { position, width, height, border, borderStyle, borderColor, borderRadius, padding, gap, vignette } =
    thumbnails;

  const offset = (animation?.duration !== undefined && animation?.increment) || 0;
  const animationDuration = animation?.duration || 0;

  const { prepareAnimation } = useAnimation<number>(track, (snapshot) => ({
    keyframes: isHorizontal(position)
      ? [
          {
            transform: `translateX(${(isRTL ? -1 : 1) * boxSize(thumbnails, width) * offset + snapshot}px)`,
          },
          { transform: "translateX(0)" },
        ]
      : [
          {
            transform: `translateY(${boxSize(thumbnails, height) * offset + snapshot}px)`,
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
  const items: { key: React.Key; index: number; slide: Slide | null }[] = [];

  if (hasSlides(slides)) {
    for (
      let index = globalIndex - preload - Math.abs(offset);
      index <= globalIndex + preload + Math.abs(offset);
      index += 1
    ) {
      const placeholder =
        (carousel.finite && (index < 0 || index > slides.length - 1)) ||
        (offset < 0 && index < globalIndex - preload) ||
        (offset > 0 && index > globalIndex + preload);
      const slide = !placeholder ? getSlide(slides, index) : null;
      const key = [`${index}`, getThumbnailKey(slide)].filter(Boolean).join("|");

      items.push({ key, index, slide });
    }
  }

  const handleClick = (slideIndex: number) => () => {
    if (slideIndex > globalIndex) {
      publish(ACTION_NEXT, { count: slideIndex - globalIndex });
    } else if (slideIndex < globalIndex) {
      publish(ACTION_PREV, { count: globalIndex - slideIndex });
    }
  };

  return (
    <div
      className={clsx(cssClass(cssPrefix("container")), cssClass(CLASS_FLEX_CENTER))}
      style={{
        ...(!visible ? { display: "none" } : null),
        ...(width !== defaultThumbnailsProps.width ? { [cssVar(cssThumbnailPrefix("width"))]: `${width}px` } : null),
        ...(height !== defaultThumbnailsProps.height
          ? { [cssVar(cssThumbnailPrefix("height"))]: `${height}px` }
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
        role="navigation"
        style={styles.thumbnailsTrack}
        className={clsx(cssClass(cssPrefix("track")), cssClass(CLASS_FLEX_CENTER))}
        aria-label={translateLabel(labels, "Thumbnails")}
        tabIndex={-1}
        {...registerSensors}
      >
        {items.map(({ key, index, slide }) => {
          const fadeAnimationDuration = animationDuration / Math.abs(offset || 1);

          const fadeIn =
            (offset > 0 && index > globalIndex + preload - offset && index <= globalIndex + preload) ||
            (offset < 0 && index < globalIndex - preload - offset && index >= globalIndex - preload)
              ? {
                  duration: fadeAnimationDuration,
                  delay:
                    ((offset > 0 ? index - (globalIndex + preload - offset) : globalIndex - preload - offset - index) -
                      1) *
                    fadeAnimationDuration,
                }
              : undefined;

          const fadeOut =
            (offset > 0 && index < globalIndex - preload) || (offset < 0 && index > globalIndex + preload)
              ? {
                  duration: fadeAnimationDuration,
                  delay:
                    (offset > 0
                      ? offset - (globalIndex - preload - index)
                      : -offset - (index - (globalIndex + preload))) * fadeAnimationDuration,
                }
              : undefined;

          return (
            <Thumbnail
              key={key}
              index={getSlideIndex(index, slides.length)}
              slide={slide}
              active={index === globalIndex}
              fadeIn={fadeIn}
              fadeOut={fadeOut}
              placeholder={!slide}
              onClick={handleClick(index)}
              onLoseFocus={() => track.current?.focus()}
            />
          );
        })}
      </nav>
      {vignette && <div className={cssClass(cssPrefix("vignette"))} />}
    </div>
  );
}
