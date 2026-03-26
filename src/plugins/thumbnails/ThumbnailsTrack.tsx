import * as React from "react";

import {
  ACTION_NEXT,
  ACTION_PREV,
  calculatePreload,
  clsx,
  cssClass,
  cssVar,
  getSlideIndex,
  getSlideKey,
  hasSlides,
  Slide,
  translateLabel,
  useEventCallback,
  useEvents,
  useKeyboardNavigation,
  useLayoutEffect,
  useLightboxProps,
  useLightboxState,
  useSensors,
} from "../../index.js";
import { cssPrefix, cssThumbnailPrefix } from "./utils.js";
import { Thumbnail } from "./Thumbnail.js";
import { defaultThumbnailsProps, useThumbnailsProps } from "./props.js";

function isHorizontal(position: ReturnType<typeof useThumbnailsProps>["position"]) {
  return ["top", "bottom"].includes(position);
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

function getShortestCarouselNavigation(
  globalIndex: number,
  targetSlideIndex: number,
  slideCount: number,
): { type: typeof ACTION_NEXT | typeof ACTION_PREV; count: number } | null {
  const currentSlideIndex = getSlideIndex(globalIndex, slideCount);
  if (currentSlideIndex === targetSlideIndex) return null;
  const stepsForward = (targetSlideIndex - currentSlideIndex + slideCount) % slideCount;
  const stepsBackward = (currentSlideIndex - targetSlideIndex + slideCount) % slideCount;
  if (stepsForward <= stepsBackward) {
    return { type: ACTION_NEXT, count: stepsForward };
  }
  return { type: ACTION_PREV, count: stepsBackward };
}

function scrollThumbnailIntoViewIfNeeded(element: HTMLElement | null | undefined) {
  const method = element?.scrollIntoView;
  if (typeof method !== "function") return;
  try {
    method.call(element, { block: "nearest", inline: "nearest", behavior: "auto" });
  } catch {
    try {
      method.call(element, false);
    } catch {
      method.call(element);
    }
  }
}

export type ThumbnailsTrackProps = {
  visible: boolean;
};

export function ThumbnailsTrack({ visible }: ThumbnailsTrackProps) {
  const track = React.useRef<HTMLDivElement>(null);

  const { publish } = useEvents();
  const { carousel, styles, labels } = useLightboxProps();
  const { slides, globalIndex } = useLightboxState();
  const { registerSensors, subscribeSensors } = useSensors();

  useKeyboardNavigation(subscribeSensors);

  const thumbnails = useThumbnailsProps();
  const { position, width, height, border, borderStyle, borderColor, borderRadius, padding, gap, vignette } =
    thumbnails;

  const handleStripWheel = useEventCallback((event: React.WheelEvent) => {
    const horizontalStrip = isHorizontal(position);
    if (horizontalStrip) {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    } else if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }
    event.stopPropagation();
  });

  const stopStripPointerBubble = useEventCallback((event: React.PointerEvent) => {
    event.stopPropagation();
  });

  const preload = calculatePreload(carousel, slides);

  const items = React.useMemo(() => {
    const list: { key: React.Key; index: number; slide: Slide | null }[] = [];
    if (!hasSlides(slides)) {
      return list;
    }
    for (let index = 0; index < slides.length; index += 1) {
      const slide = slides[index];
      const key = [`${index}`, getThumbnailKey(slide)].filter(Boolean).join("|");
      list.push({ key, index, slide });
    }
    return list;
  }, [slides]);

  const slidesLength = hasSlides(slides) ? slides.length : 0;
  const activeSlideIndex = slidesLength > 0 ? getSlideIndex(globalIndex, slidesLength) : null;

  const scrollViewportMaxPx = React.useMemo(() => {
    if (slidesLength === 0) return 0;
    const visibleSlots = Math.min(slidesLength, 2 * preload + 1);
    const dim = isHorizontal(position) ? width : height;
    return visibleSlots * (dim + 2 * (border + padding) + gap) - gap;
  }, [slidesLength, preload, position, width, height, border, padding, gap]);

  const handleThumbnailClick = useEventCallback((clickedSlideIndex: number) => {
    if (slidesLength === 0) return;
    const nav = getShortestCarouselNavigation(globalIndex, clickedSlideIndex, slidesLength);
    if (nav) {
      publish(nav.type, { count: nav.count });
    }
  });

  useLayoutEffect(() => {
    if (!visible || activeSlideIndex === null) {
      return;
    }
    scrollThumbnailIntoViewIfNeeded(track.current?.querySelector<HTMLElement>('[aria-current="true"]'));
  }, [visible, activeSlideIndex]);

  const containerStyle = React.useMemo(
    () =>
      ({
        ...(!visible ? { display: "none" } : null),
        [cssVar(cssThumbnailPrefix("width"))]: `${width}px`,
        [cssVar(cssThumbnailPrefix("height"))]: `${height}px`,
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
      }) as React.CSSProperties,
    [visible, width, height, border, borderStyle, borderColor, borderRadius, padding, gap, styles.thumbnailsContainer],
  );

  const scrollViewportStyle = React.useMemo(() => {
    const user = styles.thumbnailsScrollViewport;
    const capVar =
      scrollViewportMaxPx > 0 ? { [cssVar("thumbnails_scroll_viewport_max")]: `${scrollViewportMaxPx}px` } : undefined;
    if (!user && !capVar) return undefined;
    return { ...user, ...capVar } as React.CSSProperties;
  }, [scrollViewportMaxPx, styles.thumbnailsScrollViewport]);

  return (
    <div
      className={clsx(cssClass(cssPrefix("container")), cssClass(cssPrefix("container_scrollable")))}
      style={containerStyle}
    >
      <div
        className={cssClass(cssPrefix("scroll_viewport"))}
        style={scrollViewportStyle}
        onWheel={handleStripWheel}
        onPointerDown={stopStripPointerBubble}
        onPointerMove={stopStripPointerBubble}
        onPointerUp={stopStripPointerBubble}
        onPointerCancel={stopStripPointerBubble}
      >
        <nav
          ref={track}
          style={styles.thumbnailsTrack}
          className={cssClass(cssPrefix("track"))}
          aria-label={translateLabel(labels, "Thumbnails")}
          tabIndex={-1}
          {...registerSensors}
        >
          {items.map(({ key, index, slide }) => (
            <Thumbnail
              key={key}
              index={index}
              slide={slide}
              placeholder={!slide}
              onClick={slide ? () => handleThumbnailClick(index) : undefined}
              onLoseFocus={() => track.current?.focus()}
              active={activeSlideIndex !== null ? activeSlideIndex === index : undefined}
            />
          ))}
        </nav>
      </div>
      {vignette && <div className={cssClass(cssPrefix("vignette"))} />}
    </div>
  );
}
