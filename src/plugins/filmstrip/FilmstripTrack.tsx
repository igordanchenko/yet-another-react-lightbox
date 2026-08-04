import * as React from "react";

import {
  ACTION_GO_TO,
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
import { FilmstripThumbnail } from "./FilmstripThumbnail.js";
import { cssFilmstripPrefix, cssFilmstripThumbnailPrefix } from "./utils.js";
import { defaultFilmstripProps, useFilmstripProps } from "./props.js";

/** Extra slides mounted on each side of the visible window (not configurable). */
const VIRTUALIZATION_BUFFER = 2;

function isHorizontal(position: ReturnType<typeof useFilmstripProps>["position"]) {
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

export type FilmstripTrackProps = {
  visible: boolean;
};

export function FilmstripTrack({ visible }: FilmstripTrackProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const prevSlidesRef = React.useRef<readonly Slide[]>([]);
  const rafScrollRef = React.useRef(0);

  const { publish } = useEvents();
  const { carousel, styles, labels } = useLightboxProps();
  const { slides, globalIndex } = useLightboxState();
  const { registerSensors, subscribeSensors } = useSensors();

  useKeyboardNavigation(subscribeSensors);

  const filmstrip = useFilmstripProps();
  const {
    position,
    width,
    height,
    border,
    borderStyle,
    borderColor,
    borderRadius,
    padding,
    gap,
    vignette,
    hideScrollbar,
    scrollViewportMax,
  } = filmstrip;

  const horizontal = isHorizontal(position);
  const dim = horizontal ? width : height;
  const crossDim = horizontal ? height : width;
  const cellOuter = dim + 2 * (border + padding);
  const crossOuter = crossDim + 2 * (border + padding);
  const slotStep = cellOuter + gap;

  const preload = calculatePreload(carousel, slides);
  const slidesLength = hasSlides(slides) ? slides.length : 0;
  const activeSlideIndex = slidesLength > 0 ? getSlideIndex(globalIndex, slidesLength) : null;

  const defaultViewportCapPx = React.useMemo(() => {
    if (slidesLength === 0) return 0;
    const visibleSlots = Math.min(slidesLength, 2 * preload + 1);
    return visibleSlots * slotStep - gap;
  }, [slidesLength, preload, slotStep, gap]);

  const scrollViewportStyle = React.useMemo((): React.CSSProperties => {
    const user = styles.filmstripScrollViewport;
    const axisKey = horizontal ? "maxWidth" : "maxHeight";

    let axisValue: string | undefined;
    if (scrollViewportMax === "full") {
      axisValue = "100%";
    } else if (typeof scrollViewportMax === "number") {
      axisValue = `min(${scrollViewportMax}px, 100%)`;
    } else if (typeof scrollViewportMax === "string") {
      axisValue = scrollViewportMax;
    } else if (defaultViewportCapPx > 0) {
      axisValue = `min(${defaultViewportCapPx}px, 100%)`;
    }

    const capVar =
      defaultViewportCapPx > 0 && scrollViewportMax === undefined
        ? { [cssVar("filmstrip_scroll_viewport_max")]: `${defaultViewportCapPx}px` }
        : scrollViewportMax !== undefined && scrollViewportMax !== "full" && typeof scrollViewportMax === "number"
          ? { [cssVar("filmstrip_scroll_viewport_max")]: `${scrollViewportMax}px` }
          : null;

    const base: React.CSSProperties = { ...user, ...capVar };
    if (axisValue) {
      return { ...base, [axisKey]: axisValue } as React.CSSProperties;
    }
    return base;
  }, [horizontal, scrollViewportMax, defaultViewportCapPx, styles.filmstripScrollViewport]);

  const [scrollPos, setScrollPos] = React.useState(0);

  const onScroll = useEventCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (rafScrollRef.current) {
      cancelAnimationFrame(rafScrollRef.current);
    }
    const el = event.currentTarget;
    rafScrollRef.current = requestAnimationFrame(() => {
      rafScrollRef.current = 0;
      setScrollPos(horizontal ? el.scrollLeft : el.scrollTop);
    });
  });

  const scrollActiveIntoView = useEventCallback(() => {
    const el = scrollRef.current;
    if (!el || activeSlideIndex === null || slidesLength === 0) return;

    const thumbStart = activeSlideIndex * slotStep;
    const thumbEnd = thumbStart + cellOuter;
    const view = horizontal ? el.clientWidth : el.clientHeight;
    const scroll = horizontal ? el.scrollLeft : el.scrollTop;
    let target = scroll;
    if (thumbStart < scroll) {
      target = thumbStart;
    } else if (thumbEnd > scroll + view) {
      target = thumbEnd - view;
    }
    const scrollable = (horizontal ? el.scrollWidth : el.scrollHeight) - view;
    target = Math.max(0, Math.min(target, Math.max(0, scrollable)));
    if (horizontal) {
      el.scrollLeft = target;
    } else {
      el.scrollTop = target;
    }
    setScrollPos(target);
  });

  useLayoutEffect(() => {
    scrollActiveIntoView();
  }, [activeSlideIndex, scrollActiveIntoView]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    const prev = prevSlidesRef.current;
    if (el && slides.length > prev.length && prev.length > 0) {
      const d = slides.length - prev.length;
      if (slides[d] === prev[0]) {
        const delta = d * slotStep;
        if (horizontal) {
          el.scrollLeft += delta;
        } else {
          el.scrollTop += delta;
        }
      }
    }
    prevSlidesRef.current = slides;
    if (el) {
      setScrollPos(horizontal ? el.scrollLeft : el.scrollTop);
    }
  }, [slides, horizontal, slotStep]);

  const { startIndex, endIndex } = React.useMemo(() => {
    if (slidesLength === 0) {
      return { startIndex: 0, endIndex: -1 };
    }
    const el = scrollRef.current;
    const measured = el ? (horizontal ? el.clientWidth : el.clientHeight) : 0;
    const view = Math.max(1, measured || defaultViewportCapPx || cellOuter * 3);
    const scroll = scrollPos;
    const start = Math.max(0, Math.floor(scroll / slotStep) - VIRTUALIZATION_BUFFER);
    const lastVisible = Math.min(slidesLength - 1, Math.max(0, Math.ceil((scroll + view) / slotStep) - 1));
    const end = Math.min(slidesLength - 1, lastVisible + VIRTUALIZATION_BUFFER);
    return { startIndex: start, endIndex: end };
  }, [slidesLength, scrollPos, slotStep, horizontal, defaultViewportCapPx, cellOuter]);

  const totalAxisSize = slidesLength > 0 ? slidesLength * slotStep - gap : 0;

  const visibleIndices = React.useMemo(() => {
    if (slidesLength === 0 || endIndex < startIndex) {
      return [];
    }
    const out: number[] = [];
    for (let i = startIndex; i <= endIndex; i += 1) {
      out.push(i);
    }
    return out;
  }, [slidesLength, startIndex, endIndex]);

  const containerStyle = React.useMemo(
    () =>
      ({
        ...(!visible ? { display: "none" } : null),
        [cssVar(cssFilmstripThumbnailPrefix("width"))]: `${width}px`,
        [cssVar(cssFilmstripThumbnailPrefix("height"))]: `${height}px`,
        ...(border !== defaultFilmstripProps.border
          ? { [cssVar(cssFilmstripThumbnailPrefix("border"))]: `${border}px` }
          : null),
        ...(borderStyle ? { [cssVar(cssFilmstripThumbnailPrefix("border_style"))]: borderStyle } : null),
        ...(borderColor ? { [cssVar(cssFilmstripThumbnailPrefix("border_color"))]: borderColor } : null),
        ...(borderRadius !== defaultFilmstripProps.borderRadius
          ? { [cssVar(cssFilmstripThumbnailPrefix("border_radius"))]: `${borderRadius}px` }
          : null),
        ...(padding !== defaultFilmstripProps.padding
          ? { [cssVar(cssFilmstripThumbnailPrefix("padding"))]: `${padding}px` }
          : null),
        ...(gap !== defaultFilmstripProps.gap ? { [cssVar(cssFilmstripThumbnailPrefix("gap"))]: `${gap}px` } : null),
        ...styles.filmstripContainer,
      }) as React.CSSProperties,
    [visible, width, height, border, borderStyle, borderColor, borderRadius, padding, gap, styles.filmstripContainer],
  );

  const handleStripWheel = useEventCallback((event: React.WheelEvent) => {
    if (horizontal) {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    } else if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }
    event.stopPropagation();
  });

  const stopStripPointerBubble = useEventCallback((event: React.PointerEvent) => {
    event.stopPropagation();
  });

  const handleThumbnailClick = useEventCallback((index: number) => {
    publish(ACTION_GO_TO, { index });
  });

  const focusTrack = useEventCallback(() => {
    trackRef.current?.focus();
  });

  return (
    <div
      className={clsx(cssClass(cssFilmstripPrefix("container")), cssClass(cssFilmstripPrefix("container_scrollable")))}
      style={containerStyle}
    >
      <div
        ref={scrollRef}
        className={clsx(
          cssClass(cssFilmstripPrefix("scroll_viewport")),
          hideScrollbar && cssClass(cssFilmstripPrefix("scroll_viewport_hide_scrollbar")),
        )}
        style={scrollViewportStyle}
        onScroll={onScroll}
        onWheel={handleStripWheel}
        onPointerDown={stopStripPointerBubble}
        onPointerMove={stopStripPointerBubble}
        onPointerUp={stopStripPointerBubble}
        onPointerCancel={stopStripPointerBubble}
      >
        <nav
          ref={trackRef}
          className={cssClass(cssFilmstripPrefix("track"))}
          style={{
            ...styles.filmstripTrack,
            width: horizontal ? totalAxisSize : crossOuter,
            height: horizontal ? crossOuter : totalAxisSize,
            minWidth: horizontal ? totalAxisSize : crossOuter,
            minHeight: horizontal ? crossOuter : totalAxisSize,
          }}
          aria-label={translateLabel(labels, "Filmstrip")}
          tabIndex={-1}
          {...registerSensors}
        >
          {visibleIndices.map((index) => {
            const slide = slides[index];
            const key = [`${index}`, getThumbnailKey(slide)].filter(Boolean).join("|");
            return (
              <div
                key={key}
                style={{
                  position: "absolute",
                  left: horizontal ? index * slotStep : 0,
                  top: horizontal ? 0 : index * slotStep,
                  width: horizontal ? cellOuter : "100%",
                  height: horizontal ? crossOuter : cellOuter,
                }}
              >
                <FilmstripThumbnail
                  index={index}
                  slide={slide}
                  onActivate={handleThumbnailClick}
                  onLoseFocus={focusTrack}
                  active={activeSlideIndex !== null ? activeSlideIndex === index : undefined}
                  imageLazy
                />
              </div>
            );
          })}
        </nav>
      </div>
      {vignette && <div className={cssClass(cssFilmstripPrefix("vignette"))} />}
    </div>
  );
}
