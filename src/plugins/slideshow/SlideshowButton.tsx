import * as React from "react";

import {
    ACTION_NEXT,
    ACTIVE_SLIDE_COMPLETE,
    ACTIVE_SLIDE_ERROR,
    ACTIVE_SLIDE_LOADING,
    ACTIVE_SLIDE_PLAYING,
    cleanup,
    createIcon,
    IconButton,
    label,
    SLIDE_STATUS_COMPLETE,
    SLIDE_STATUS_ERROR,
    SLIDE_STATUS_LOADING,
    SLIDE_STATUS_PLAYING,
    SlideStatus,
    useController,
    useEventCallback,
    useEvents,
    useLightboxState,
    useTimeouts,
} from "../../core/index.js";
import { defaultSlideshowProps } from "./Slideshow.js";

const PlayIcon = createIcon("Play", <path d="M8 5v14l11-7z" />);

const PauseIcon = createIcon("Pause", <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />);

export const SlideshowButton: React.FC = () => {
    const { currentIndex } = useLightboxState().state;
    const { getLightboxProps } = useController();
    const { setTimeout, clearTimeout } = useTimeouts();
    const { publish, subscribe } = useEvents();

    const {
        slideshow: slideshowProps,
        carousel: { finite },
        slides,
        render,
        labels,
    } = getLightboxProps();
    const slidesCount = slides.length;

    const slideshow = { ...defaultSlideshowProps, ...slideshowProps };

    const [playing, setPlaying] = React.useState(slideshow.autoplay);
    const scheduler = React.useRef<number>();

    const slideStatus = React.useRef<SlideStatus | undefined>();

    const cancelScheduler = React.useCallback(() => {
        clearTimeout(scheduler.current);
        scheduler.current = undefined;
    }, [clearTimeout]);

    const reachedLastSlide = useEventCallback(
        () => slides.length === 0 || (finite && currentIndex === slidesCount - 1)
    );

    const scheduleNextSlide = useEventCallback(() => {
        cancelScheduler();

        if (
            !playing ||
            reachedLastSlide() ||
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
        }, slideshow.delay);
    });

    const togglePlaying = React.useCallback(() => {
        setPlaying((prev) => !prev);
    }, []);

    React.useEffect(scheduleNextSlide, [currentIndex, playing, scheduleNextSlide]);

    React.useEffect(() => {
        if (playing && reachedLastSlide()) {
            setPlaying(false);
        }
    }, [currentIndex, playing, reachedLastSlide]);

    React.useEffect(
        () =>
            cleanup(
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
                cancelScheduler
            ),
        [subscribe, cancelScheduler, scheduleNextSlide]
    );

    const disabled = reachedLastSlide();

    return render.buttonSlideshow ? (
        <>{render.buttonSlideshow({ playing, togglePlaying, disabled })}</>
    ) : (
        <IconButton
            label={playing ? label(labels, "Pause") : label(labels, "Play")}
            icon={playing ? PauseIcon : PlayIcon}
            renderIcon={playing ? render.iconSlideshowPause : render.iconSlideshowPlay}
            onClick={togglePlaying}
            disabled={disabled}
            aria-disabled={disabled}
        />
    );
};
