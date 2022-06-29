import * as React from "react";

import { Component, DeepNonNullable, ImageFit, LightboxProps, Plugin, Render, Slide } from "../types.js";
import {
    clsx,
    ContainerRect,
    createIcon,
    createModule,
    cssClass,
    cssVar,
    ImageSlide,
    useEnhancedEffect,
    useEvents,
    useLatest,
    useMotionPreference,
    useRTL,
} from "../core/index.js";

export type Position = "top" | "bottom" | "start" | "end";

declare module "../types.js" {
    interface LightboxProps {
        /** Thumbnails plugin settings */
        thumbnails?: {
            /** thumbnails position */
            position?: Position;
            /** thumbnail width */
            width?: number;
            /** thumbnail height */
            height?: number;
            /** thumbnail border width */
            border?: number;
            /** thumbnail border radius */
            borderRadius?: number;
            /** thumbnail inner padding */
            padding?: number;
            /** gap between thumbnails */
            gap?: number;
            /** `object-fit` setting */
            imageFit?: ImageFit;
        };
    }

    interface Render {
        thumbnail?: ({
            slide,
            rect,
            render,
            imageFit,
        }: {
            slide: Slide;
            rect: ContainerRect;
            render: Render;
            imageFit: ImageFit;
        }) => React.ReactNode;
    }
}

type ThumbnailsInternal = DeepNonNullable<LightboxProps["thumbnails"]>;

const defaultThumbnailsProps: ThumbnailsInternal = {
    position: "bottom",
    width: 120,
    height: 80,
    border: 1,
    borderRadius: 4,
    padding: 4,
    gap: 16,
    imageFit: "contain",
};

const VideoThumbnailIcon = createIcon(
    "VideoThumbnail",
    <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
);

const UnknownThumbnailIcon = createIcon(
    "UnknownThumbnail",
    <path d="M23 18V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zM8.5 12.5l2.5 3.01L14.5 11l4.5 6H5l3.5-4.5z" />
);

const cssPrefix = (value?: string) => `thumbnails${value ? `_${value}` : ""}`;

const cssThumbnailPrefix = (value?: string) => cssPrefix(`thumbnail${value ? `_${value}` : ""}`);

const getSlide = (slides: Slide[], index: number) => slides[((index % slides.length) + slides.length) % slides.length];

const isHorizontal = (position: Position) => ["top", "bottom"].includes(position);

const boxSize = (thumbnails: ThumbnailsInternal, dimension: number, includeGap?: boolean) =>
    dimension + 2 * (thumbnails.border + thumbnails.padding) + (includeGap ? thumbnails.gap : 0);

type FadeSettings = {
    duration: number;
    delay: number;
};

type ThumbnailProps = {
    rect: ContainerRect;
    slide: Slide | null;
    onClick: () => void;
    active: boolean;
    fadeIn?: FadeSettings;
    fadeOut?: FadeSettings;
    placeholder: boolean;
    render: LightboxProps["render"];
    imageFit: ImageFit;
};

const renderThumbnail: Render["thumbnail"] = ({ slide, render, rect, imageFit }) => {
    const customThumbnail = render.thumbnail?.({ slide, render, rect, imageFit });
    if (customThumbnail) {
        return customThumbnail;
    }

    const thumbnailIconClass = cssClass(cssThumbnailPrefix("icon"));

    if ("type" in slide) {
        if (slide.type === "video") {
            return (
                <>
                    {"poster" in slide && (
                        <img
                            alt=""
                            src={slide.poster}
                            className={clsx(cssClass("fullsize"), cssClass(cssPrefix("contain_image")))}
                        />
                    )}
                    <VideoThumbnailIcon className={thumbnailIconClass} />
                </>
            );
        }
    } else if ("src" in slide) {
        return <ImageSlide slide={slide} render={render} rect={rect} imageFit={imageFit} />;
    }

    return <UnknownThumbnailIcon className={thumbnailIconClass} />;
};

const Thumbnail: React.FC<ThumbnailProps> = ({
    rect,
    slide,
    onClick,
    active,
    fadeIn,
    fadeOut,
    placeholder,
    render,
    imageFit,
}) => (
    <button
        type="button"
        className={clsx(
            cssClass(cssThumbnailPrefix()),
            active && cssClass(cssThumbnailPrefix("active")),
            fadeIn && cssClass(cssThumbnailPrefix("fadein")),
            fadeOut && cssClass(cssThumbnailPrefix("fadeout")),
            placeholder && cssClass(cssThumbnailPrefix("placeholder"))
        )}
        style={{
            ...(fadeIn
                ? {
                      [cssVar(cssThumbnailPrefix("fadein_duration"))]: `${fadeIn.duration}ms`,
                      [cssVar(cssThumbnailPrefix("fadein_delay"))]: `${fadeIn.delay}ms`,
                  }
                : null),
            ...(fadeOut
                ? {
                      [cssVar(cssThumbnailPrefix("fadeout_duration"))]: `${fadeOut.duration}ms`,
                      [cssVar(cssThumbnailPrefix("fadeout_delay"))]: `${fadeOut.delay}ms`,
                  }
                : null),
        }}
        onClick={onClick}
    >
        {slide && renderThumbnail({ slide, render, rect, imageFit })}
    </button>
);

type ThumbnailsTrackState = {
    index: number;
    offset: number;
};

type ThumbnailsTrackRefs = Pick<LightboxProps, "carousel" | "animation"> & {
    state: ThumbnailsTrackState;
    thumbnails: ThumbnailsInternal;
    animationOffset: number;
    animationOverride?: number;
};

type ThumbnailsTrackProps = Pick<LightboxProps, "slides" | "carousel" | "animation" | "render"> & {
    container: React.RefObject<HTMLDivElement>;
    thumbnails: ThumbnailsInternal;
    startingIndex: number;
    thumbnailRect: ContainerRect;
};

export const ThumbnailsTrack: React.FC<ThumbnailsTrackProps> = ({
    container,
    startingIndex,
    slides,
    carousel,
    animation,
    render,
    thumbnails,
    thumbnailRect,
}) => {
    const track = React.useRef<HTMLDivElement | null>(null);

    const [state, setState] = React.useState<ThumbnailsTrackState>({
        index: startingIndex,
        offset: 0,
    });

    const { publish, subscribe } = useEvents();
    const reduceMotion = useLatest(useMotionPreference());
    const isRTL = useLatest(useRTL());

    const refs = React.useRef<ThumbnailsTrackRefs>({
        state,
        thumbnails,
        carousel,
        animation,
        animationOffset: 0,
    });
    refs.current.state = state;
    refs.current.thumbnails = thumbnails;
    refs.current.carousel = carousel;
    refs.current.animation = animation;

    const animationRef = React.useRef<Animation>();

    React.useEffect(
        () =>
            subscribe("controller-swipe", (_, event) => {
                if (event && typeof event === "object" && "globalIndex" in event) {
                    const { current } = refs;

                    if (container.current && track.current) {
                        const containerRect = container.current.getBoundingClientRect();
                        const trackRect = track.current.getBoundingClientRect();
                        current.animationOffset = isHorizontal(refs.current.thumbnails.position)
                            ? trackRect.left - (containerRect.width - trackRect.width) / 2
                            : trackRect.top - (containerRect.height - trackRect.height) / 2;
                    } else {
                        current.animationOffset = 0;
                    }

                    current.animationOverride =
                        "animationDuration" in event
                            ? (event as { animationDuration: number }).animationDuration
                            : undefined;

                    const newIndex = (event as { globalIndex: number }).globalIndex;
                    setState({
                        index: newIndex,
                        offset: newIndex - current.state.index,
                    });
                }
            }),
        [container, subscribe]
    );

    useEnhancedEffect(() => {
        if (track.current && state.offset) {
            const { current } = refs;

            animationRef.current?.cancel();

            const animationDuration = current.animationOverride ?? current.animation.swipe;

            animationRef.current = track.current.animate?.(
                isHorizontal(current.thumbnails.position)
                    ? [
                          {
                              transform: `translate3d(${
                                  (isRTL.current ? -1 : 1) *
                                      boxSize(current.thumbnails, current.thumbnails.width, true) *
                                      state.offset +
                                  current.animationOffset
                              }px, 0, 0)`,
                          },
                          { transform: "translate3d(0, 0, 0)" },
                      ]
                    : [
                          {
                              transform: `translate3d(0, ${
                                  boxSize(current.thumbnails, current.thumbnails.height, true) * state.offset +
                                  current.animationOffset
                              }px, 0)`,
                          },
                          { transform: "translate3d(0, 0, 0)" },
                      ],
                reduceMotion.current ? 0 : animationDuration
            );

            if (animationRef.current) {
                animationRef.current.onfinish = () => {
                    animationRef.current = undefined;

                    if (refs.current.state.index === state.index) {
                        setState({ index: state.index, offset: 0 });
                    }
                };
            }

            current.animationOffset = 0;
        }
    }, [state.index, state.offset, isRTL, reduceMotion]);

    const { index, offset } = state;
    const { finite, preload } = carousel;

    const items: { slide: Slide | null; index: number; placeholder?: boolean }[] = [];

    if (slides.length > 0) {
        if (offset < 0) {
            for (let i = index - preload + offset; i < index - preload; i += 1) {
                items.push({ slide: null, index: i, placeholder: true });
            }
        }

        for (let i = index - preload - (offset > 0 ? offset : 0); i < index; i += 1) {
            if (!(finite && i < 0)) {
                items.push({ slide: getSlide(slides, i), index: i });
            } else {
                items.push({ slide: null, index: i, placeholder: true });
            }
        }

        items.push({ slide: getSlide(slides, index), index });

        for (let i = index + 1; i <= index + preload - (offset < 0 ? offset : 0); i += 1) {
            if (!finite || i <= slides.length - 1) {
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
            publish("next", slideIndex - index);
        } else if (slideIndex < index) {
            publish("prev", index - slideIndex);
        }
    };

    const { width, height, border, borderRadius, padding, gap, imageFit } = thumbnails;

    return (
        <div
            className={clsx(cssClass(cssPrefix("container")), cssClass("flex_center"))}
            style={{
                ...(width !== defaultThumbnailsProps.width
                    ? { [cssVar(cssThumbnailPrefix("width"))]: `${boxSize(thumbnails, width)}px` }
                    : null),
                ...(height !== defaultThumbnailsProps.height
                    ? { [cssVar(cssThumbnailPrefix("height"))]: `${boxSize(thumbnails, height)}px` }
                    : null),
                ...(border !== defaultThumbnailsProps.border
                    ? { [cssVar(cssThumbnailPrefix("border"))]: `${border}px` }
                    : null),
                ...(borderRadius !== defaultThumbnailsProps.borderRadius
                    ? { [cssVar(cssThumbnailPrefix("border_radius"))]: `${borderRadius}px` }
                    : null),
                ...(padding !== defaultThumbnailsProps.padding
                    ? { [cssVar(cssThumbnailPrefix("padding"))]: `${padding}px` }
                    : null),
                ...(gap !== defaultThumbnailsProps.gap ? { [cssVar(cssThumbnailPrefix("gap"))]: `${gap}px` } : null),
            }}
        >
            <nav ref={track} className={cssClass(cssPrefix("track"))}>
                {items.map(({ slide, index: slideIndex, placeholder }) => {
                    const fadeAnimationDuration =
                        (refs.current.animationOverride ?? animation.swipe) / Math.abs(offset || 1);

                    const fadeIn =
                        (offset > 0 && slideIndex > index + preload - offset && slideIndex <= index + preload) ||
                        (offset < 0 && slideIndex < index - preload - offset && slideIndex >= index - preload)
                            ? {
                                  duration: fadeAnimationDuration,
                                  delay:
                                      ((offset > 0
                                          ? slideIndex - (index + preload - offset)
                                          : index - preload - offset - slideIndex) -
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
                            key={slideIndex}
                            rect={thumbnailRect}
                            slide={slide}
                            imageFit={imageFit}
                            render={render}
                            active={slideIndex === index}
                            fadeIn={fadeIn}
                            fadeOut={fadeOut}
                            placeholder={Boolean(placeholder)}
                            onClick={handleClick(slideIndex)}
                        />
                    );
                })}
            </nav>
        </div>
    );
};

/** Thumbnails plugin component */
export const ThumbnailsComponent: Component = ({
    thumbnails: thumbnailsProps,
    slides,
    index,
    carousel,
    animation,
    render,
    children,
}) => {
    const thumbnails = { ...defaultThumbnailsProps, ...thumbnailsProps };

    const ref = React.useRef<HTMLDivElement | null>(null);

    const track = (
        <ThumbnailsTrack
            container={ref}
            slides={slides}
            thumbnails={thumbnails}
            carousel={carousel}
            animation={animation}
            render={render}
            startingIndex={index}
            thumbnailRect={{ width: thumbnails.width, height: thumbnails.height }}
        />
    );

    return (
        <div
            ref={ref}
            className={clsx(cssClass(cssPrefix()), cssClass(cssPrefix(`${thumbnails.position}`)), cssClass("fullsize"))}
        >
            {(thumbnails.position === "start" || thumbnails.position === "top") && track}
            <div className={cssClass(cssPrefix("wrapper"))}>{children}</div>
            {(thumbnails.position === "end" || thumbnails.position === "bottom") && track}
        </div>
    );
};

/** Thumbnails plugin */
export const Thumbnails: Plugin = ({ augment, contains, append, addParent }) => {
    augment(({ thumbnails, ...restProps }) => ({
        thumbnails: {
            ...defaultThumbnailsProps,
            ...thumbnails,
        },
        ...restProps,
    }));

    const module = createModule("thumbnails", ThumbnailsComponent);
    if (contains("fullscreen")) {
        append("fullscreen", module);
    } else {
        addParent("controller", module);
    }
};

export default Thumbnails;
