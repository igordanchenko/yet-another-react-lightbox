import * as React from "react";

import { Plugin } from "../types.js";
import {
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
    useEvents,
    useLatest,
    useTimeouts,
} from "../core/index.js";

const defaultSlideshowProps = {
    autoplay: false,
    delay: 3000,
};

declare module "../types.js" {
    interface LightboxProps {
        /** Slideshow plugin settings */
        slideshow?: {
            /** if `true`, slideshow is turned on automatically when the lightbox opens */
            autoplay?: boolean;
            /** slideshow delay in milliseconds */
            delay?: number;
        };
    }

    interface Render {
        /** render custom Slideshow Play icon */
        iconSlideshowPlay?: () => React.ReactNode;
        /** render custom Slideshow Pause icon */
        iconSlideshowPause?: () => React.ReactNode;
        /** render custom Slideshow button */
        buttonSlideshow?: ({
            playing,
            togglePlaying,
            disabled,
        }: {
            /** current slideshow autoplay status */
            playing: boolean;
            /** toggle slideshow autoplay status */
            togglePlaying: () => void;
            /** if `true`, the button is disabled */
            disabled: boolean;
        }) => React.ReactNode;
    }
}

const PlayIcon = createIcon("Play", <path d="M8 5v14l11-7z" />);

const PauseIcon = createIcon("Pause", <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />);

type SlideshowButtonRefs = {
    playing: boolean;
    delay: number;
    currentIndex: number;
    finite: boolean;
    slidesCount: number;
};

const SlideshowButton: React.FC = () => {
    const { currentIndex, latestProps } = useController();
    const { setTimeout, clearTimeout } = useTimeouts();
    const { publish, subscribe } = useEvents();

    const slideshow = {
        ...defaultSlideshowProps,
        ...latestProps.current.slideshow,
    };

    const [playing, setPlaying] = React.useState(slideshow.autoplay);
    const scheduler = React.useRef<number>();

    const refs = useLatest<SlideshowButtonRefs>({
        playing,
        delay: slideshow.delay,
        currentIndex,
        finite: latestProps.current.carousel.finite,
        slidesCount: latestProps.current.slides.length,
    });

    const slideStatus = React.useRef<SlideStatus | undefined>();

    const cancelScheduler = React.useCallback(() => {
        clearTimeout(scheduler.current);
        scheduler.current = undefined;
    }, [clearTimeout]);

    const reachedLastSlide = React.useCallback(
        () => refs.current.finite && refs.current.currentIndex === refs.current.slidesCount - 1,
        [refs]
    );

    const scheduleNextSlide = React.useCallback(() => {
        cancelScheduler();

        if (
            !refs.current.playing ||
            reachedLastSlide() ||
            slideStatus.current === SLIDE_STATUS_LOADING ||
            slideStatus.current === SLIDE_STATUS_PLAYING
        ) {
            return;
        }

        scheduler.current = setTimeout(() => {
            if (refs.current.playing) {
                slideStatus.current = undefined;
                publish("next");
            }
        }, refs.current.delay);
    }, [publish, setTimeout, cancelScheduler, refs, reachedLastSlide]);

    const togglePlaying = React.useCallback(() => {
        setPlaying((prev) => !prev);
    }, []);

    React.useEffect(() => {
        scheduleNextSlide();
    }, [currentIndex, playing, scheduleNextSlide]);

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
                })
            ),
        [subscribe, cancelScheduler, scheduleNextSlide]
    );

    const { render, labels } = latestProps.current;
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

/** Slideshow plugin */
export const Slideshow: Plugin = ({ augment }) => {
    augment(({ slideshow: originalSlideshow, toolbar: { buttons, ...restToolbar }, ...restProps }) => ({
        toolbar: {
            buttons: [<SlideshowButton key="slideshow" />, ...buttons],
            ...restToolbar,
        },
        slideshow: {
            ...defaultSlideshowProps,
            ...originalSlideshow,
        },
        ...restProps,
    }));
};

// noinspection JSUnusedGlobalSymbols
export default Slideshow;
