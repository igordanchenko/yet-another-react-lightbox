import * as React from "react";

import {
  ACTIVE_SLIDE_COMPLETE,
  ACTIVE_SLIDE_ERROR,
  ACTIVE_SLIDE_LOADING,
  ACTIVE_SLIDE_PLAYING,
  cleanup,
  ComponentProps,
  makeUseContext,
  SLIDE_STATUS_COMPLETE,
  SLIDE_STATUS_ERROR,
  SLIDE_STATUS_LOADING,
  SLIDE_STATUS_PLAYING,
  SlideshowRef,
  SlideStatus,
  useController,
  useEventCallback,
  useEvents,
  useLightboxState,
  useTimeouts,
} from "../../index.js";
import { resolveSlideshowProps } from "./props.js";
import { useFocusWithin } from "../../hooks/useFocusWithin.js";

export const SlideshowContext = React.createContext<SlideshowRef | null>(null);

export const useSlideshow = makeUseContext("useSlideshow", "SlideshowContext", SlideshowContext);

export function SlideshowContextProvider({ slideshow, carousel: { finite }, on, children }: ComponentProps) {
  const { autoplay, delay, ref } = resolveSlideshowProps(slideshow);

  const wasPlaying = React.useRef(autoplay);
  const [playing, setPlaying] = React.useState(autoplay);

  const scheduler = React.useRef<number>(undefined);
  const slideStatus = React.useRef<SlideStatus>(undefined);

  const { slides, currentIndex } = useLightboxState();
  const { setTimeout, clearTimeout } = useTimeouts();
  const { subscribe } = useEvents();
  const { next, containerRef, carouselRef } = useController();

  const disabled = slides.length === 0 || (finite && currentIndex === slides.length - 1);

  const play = React.useCallback(() => {
    if (!playing && !disabled) {
      setPlaying(true);
    }
  }, [playing, disabled]);

  const pause = React.useCallback(() => {
    if (playing) {
      setPlaying(false);
    }
  }, [playing]);

  const cancelScheduler = React.useCallback(() => {
    clearTimeout(scheduler.current);
    scheduler.current = undefined;
  }, [clearTimeout]);

  const scheduleNextSlide = useEventCallback(() => {
    cancelScheduler();

    if (
      !playing ||
      disabled ||
      slideStatus.current === SLIDE_STATUS_LOADING ||
      slideStatus.current === SLIDE_STATUS_PLAYING
    ) {
      return;
    }

    scheduler.current = setTimeout(() => {
      if (playing) {
        slideStatus.current = undefined;
        next();
      }
    }, delay);
  });

  React.useEffect(scheduleNextSlide, [currentIndex, playing, scheduleNextSlide]);

  React.useEffect(() => {
    if (playing && disabled) {
      setPlaying(false);
    }
  }, [currentIndex, playing, disabled]);

  const onSlideshowStart = useEventCallback(() => on.slideshowStart?.());

  const onSlideshowStop = useEventCallback(() => on.slideshowStop?.());

  React.useEffect(() => {
    if (playing) {
      onSlideshowStart();
    } else if (wasPlaying.current) {
      onSlideshowStop();
    }

    wasPlaying.current = playing;
  }, [playing, onSlideshowStart, onSlideshowStop]);

  const { isFocusWithin } = useFocusWithin(containerRef);

  React.useEffect(() => {
    carouselRef.current?.setAttribute("aria-live", !isFocusWithin && playing ? "off" : "polite");
  }, [isFocusWithin, carouselRef, playing]);

  React.useEffect(
    () =>
      cleanup(
        cancelScheduler,
        subscribe(ACTIVE_SLIDE_LOADING, () => {
          slideStatus.current = SLIDE_STATUS_LOADING;
          cancelScheduler();
        }),
        subscribe(ACTIVE_SLIDE_PLAYING, () => {
          slideStatus.current = SLIDE_STATUS_PLAYING;
          cancelScheduler();
        }),
        subscribe(ACTIVE_SLIDE_ERROR, () => {
          slideStatus.current = SLIDE_STATUS_ERROR;
          scheduleNextSlide();
        }),
        subscribe(ACTIVE_SLIDE_COMPLETE, () => {
          slideStatus.current = SLIDE_STATUS_COMPLETE;
          scheduleNextSlide();
        }),
      ),
    [subscribe, cancelScheduler, scheduleNextSlide],
  );

  const context = React.useMemo(() => ({ playing, disabled, play, pause }), [playing, disabled, play, pause]);

  React.useImperativeHandle(ref, () => context, [context]);

  return <SlideshowContext.Provider value={context}>{children}</SlideshowContext.Provider>;
}
