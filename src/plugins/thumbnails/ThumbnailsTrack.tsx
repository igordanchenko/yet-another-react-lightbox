import * as React from "react";

import {
    ACTION_NEXT,
    ACTION_PREV,
    CLASS_FLEX_CENTER,
    clsx,
    ContainerRect,
    cssClass,
    cssVar,
    useEventCallback,
    useEvents,
    useLayoutEffect,
    useLightboxState,
    useMotionPreference,
    useRTL,
} from "../../core/index.js";
import { DeepNonNullable, LightboxProps, Slide } from "../../types.js";
import { cssPrefix, cssThumbnailPrefix } from "./utils.js";
import { Thumbnail } from "./Thumbnail.js";
import { defaultThumbnailsProps } from "./Thumbnails.js";

const isHorizontal = (position: NonNullable<NonNullable<LightboxProps["thumbnails"]>["position"]>) =>
    ["top", "bottom"].includes(position);

const boxSize = (thumbnails: ThumbnailsInternal, dimension: number, includeGap?: boolean) =>
    dimension + 2 * (thumbnails.border + thumbnails.padding) + (includeGap ? thumbnails.gap : 0);

const getSlide = (slides: Slide[], index: number) => slides[((index % slides.length) + slides.length) % slides.length];

type ThumbnailsInternal = DeepNonNullable<LightboxProps["thumbnails"]>;

type ThumbnailsTrackProps = Pick<LightboxProps, "slides" | "carousel" | "animation" | "render" | "styles"> & {
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
    render,
    thumbnails,
    thumbnailRect,
    styles,
}) => {
    const [index, setIndex] = React.useState(startingIndex);
    const [offset, setOffset] = React.useState(0);

    const track = React.useRef<HTMLDivElement | null>(null);
    const animationRef = React.useRef<Animation>();
    const animationOffset = React.useRef(0);

    const {
        state: { globalIndex, animationDuration },
    } = useLightboxState();
    const { publish } = useEvents();
    const reduceMotion = useMotionPreference();
    const isRTL = useRTL();

    const handleControllerSwipe = useEventCallback(() => {
        if (container.current && track.current) {
            const containerRect = container.current.getBoundingClientRect();
            const trackRect = track.current.getBoundingClientRect();
            animationOffset.current = isHorizontal(thumbnails.position)
                ? trackRect.left - (containerRect.width - trackRect.width) / 2
                : trackRect.top - (containerRect.height - trackRect.height) / 2;
        } else {
            animationOffset.current = 0;
        }

        setIndex(globalIndex);
        setOffset(globalIndex - index);
    });

    React.useEffect(handleControllerSwipe, [globalIndex, handleControllerSwipe]);

    const getCurrentIndex = useEventCallback(() => index);

    const handleIndexOffsetChange = useEventCallback(() => {
        if (track.current && offset) {
            animationRef.current?.cancel();

            animationRef.current = track.current.animate?.(
                isHorizontal(thumbnails.position)
                    ? [
                          {
                              transform: `translateX(${
                                  (isRTL ? -1 : 1) * boxSize(thumbnails, thumbnails.width, true) * offset +
                                  animationOffset.current
                              }px)`,
                          },
                          { transform: "translateX(0)" },
                      ]
                    : [
                          {
                              transform: `translateY(${
                                  boxSize(thumbnails, thumbnails.height, true) * offset + animationOffset.current
                              }px)`,
                          },
                          { transform: "translateY(0)" },
                      ],
                !reduceMotion ? animationDuration : 0
            );

            if (animationRef.current) {
                animationRef.current.onfinish = () => {
                    animationRef.current = undefined;

                    if (getCurrentIndex() === index) {
                        setOffset(0);
                    }
                };
            }

            animationOffset.current = 0;
        }
    });

    useLayoutEffect(handleIndexOffsetChange, [index, offset, handleIndexOffsetChange]);

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
            publish(ACTION_NEXT, slideIndex - index);
        } else if (slideIndex < index) {
            publish(ACTION_PREV, index - slideIndex);
        }
    };

    const { width, height, border, borderRadius, padding, gap, imageFit, vignette } = thumbnails;

    return (
        <div
            className={clsx(cssClass(cssPrefix("container")), cssClass(CLASS_FLEX_CENTER))}
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
                ...styles.thumbnailsContainer,
            }}
        >
            <nav
                ref={track}
                style={styles.thumbnailsTrack}
                className={clsx(cssClass(cssPrefix("track")), cssClass(CLASS_FLEX_CENTER))}
            >
                {items.map(({ slide, index: slideIndex, placeholder }) => {
                    const fadeAnimationDuration = animationDuration / Math.abs(offset || 1);

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
                            style={styles.thumbnail}
                        />
                    );
                })}
            </nav>
            {vignette && <div className={cssClass(cssPrefix("vignette"))} />}
        </div>
    );
};
