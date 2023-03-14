import * as React from "react";

import { ComponentProps } from "../../types.js";
import {
    ACTION_NEXT,
    ACTIVE_SLIDE_COMPLETE,
    ACTIVE_SLIDE_ERROR,
    ACTIVE_SLIDE_LOADING,
    ACTIVE_SLIDE_PLAYING,
    cleanup,
    makeUseContext,
    SLIDE_STATUS_COMPLETE,
    SLIDE_STATUS_ERROR,
    SLIDE_STATUS_LOADING,
    SLIDE_STATUS_PLAYING,
    SlideStatus,
    useEventCallback,
    useEvents,
    useLightboxState,
    useTimeouts,
} from "../../core/index.js";
import { defaultSlideshowProps } from "./Slideshow.js";

export type SlideshowContextType = {
    playing: boolean;
    disabled: boolean;

    togglePlaying: () => void;
};

const SlideshowContext = React.createContext<SlideshowContextType | null>(null);

export const useSlideshow = makeUseContext("useSlideshow", "SlideshowContext", SlideshowContext);

export function SlideshowContextProvider({ slideshow, carousel: { finite }, children }: ComponentProps) {
    const { autoplay, delay } = { ...defaultSlideshowProps, ...slideshow };

    const [playing, setPlaying] = React.useState(autoplay);

    const scheduler = React.useRef<number>();
    const slideStatus = React.useRef<SlideStatus | undefined>();

    const { slides, currentIndex } = useLightboxState().state;
    const { setTimeout, clearTimeout } = useTimeouts();
    const { publish, subscribe } = useEvents();

    const disabled = slides.length === 0 || (finite && currentIndex === slides.length - 1);

    const togglePlaying = React.useCallback(() => {
        setPlaying((prev) => !prev);
    }, []);

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
                publish(ACTION_NEXT);
            }
        }, delay);
    });

    React.useEffect(scheduleNextSlide, [currentIndex, playing, scheduleNextSlide]);

    React.useEffect(() => {
        if (playing && disabled) {
            setPlaying(false);
        }
    }, [currentIndex, playing, disabled]);

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
                })
            ),
        [subscribe, cancelScheduler, scheduleNextSlide]
    );

    const context = React.useMemo(() => ({ playing, disabled, togglePlaying }), [playing, disabled, togglePlaying]);

    return <SlideshowContext.Provider value={context}>{children}</SlideshowContext.Provider>;
}
