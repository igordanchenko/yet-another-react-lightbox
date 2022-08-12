import * as React from "react";

import { Component, ComponentProps } from "../../types.js";
import { createModule } from "../config.js";
import {
    cleanup,
    clsx,
    cssClass,
    cssVar,
    isNumber,
    makeComposePrefix,
    makeUseContext,
    parseLengthPercentage,
} from "../utils.js";
import {
    ContainerRect,
    SubscribeSensors,
    useContainerRect,
    useEventCallback,
    useForkRef,
    useLayoutEffect,
    useMotionPreference,
    useRTL,
    useSensors,
} from "../hooks/index.js";
import { useEvents, useLightboxState, useTimeouts } from "../contexts/index.js";
import { SwipeState, usePointerSwipe, usePreventSwipeNavigation, useWheelSwipe } from "./controller/index.js";
import {
    ACTION_CLOSE,
    ACTION_NEXT,
    ACTION_PREV,
    CLASS_FLEX_CENTER,
    EVENT_ON_KEY_UP,
    MODULE_CONTROLLER,
    VK_ESCAPE,
    YARL_EVENT_BACKDROP_CLICK,
} from "../consts.js";

const cssContainerPrefix = makeComposePrefix("container");

export type ControllerContextType = {
    getLightboxProps: () => ComponentProps;
    subscribeSensors: SubscribeSensors<HTMLDivElement>;
    transferFocus: () => void;
    containerRect: ContainerRect;
    containerRef: React.RefObject<HTMLDivElement>;
    setCarouselRef: React.Ref<HTMLDivElement>;
};

const ControllerContext = React.createContext<ControllerContextType | null>(null);

export const useController = makeUseContext("useController", "ControllerContext", ControllerContext);

export const Controller: Component = ({ children, ...props }) => {
    const { carousel, slides, animation, controller, on, styles } = props;

    const { state, dispatch } = useLightboxState();

    const [swipeState, setSwipeState] = React.useState(SwipeState.NONE);
    const swipeOffset = React.useRef(0);
    const swipeAnimationReset = React.useRef<number>();

    const { registerSensors, subscribeSensors } = useSensors<HTMLDivElement>();
    const { subscribe, publish } = useEvents();
    const { setTimeout, clearTimeout } = useTimeouts();

    const { containerRef, setContainerRef, containerRect } = useContainerRect<HTMLDivElement>();
    const handleContainerRef = useForkRef(usePreventSwipeNavigation(), setContainerRef);

    const carouselRef = React.useRef<HTMLDivElement | null>(null);
    const setCarouselRef = useForkRef(carouselRef, undefined);

    const carouselAnimation = React.useRef<Animation>();
    const carouselSwipeAnimation = React.useRef<{ rect: DOMRect; index: number }>();

    const reduceMotion = useMotionPreference();

    const isRTL = useRTL();

    const rtl = useEventCallback((value?: number) => (isRTL ? -1 : 1) * (isNumber(value) ? value : 1));

    const isSwipeValid = useEventCallback(
        (offset: number) =>
            !(
                carousel.finite &&
                ((rtl(offset) > 0 && state.currentIndex === 0) ||
                    (rtl(offset) < 0 && state.currentIndex === slides.length - 1))
            )
    );

    const setSwipeOffset = React.useCallback(
        (offset: number) => {
            swipeOffset.current = offset;

            containerRef.current?.style.setProperty(cssVar("swipe_offset"), `${Math.round(offset)}px`);
        },
        [containerRef]
    );

    const swipe = useEventCallback(
        (action: { direction?: "prev" | "next"; count?: number; offset?: number; duration?: number }) => {
            const swipeDuration = animation.swipe;
            const currentSwipeOffset = action.offset || 0;

            let { direction } = action;
            const count = action.count ?? 1;

            let newSwipeState: SwipeState = SwipeState.ANIMATION;
            let newSwipeAnimationDuration = swipeDuration * count;

            if (!direction) {
                const containerWidth = containerRect?.width;

                const elapsedTime = action.duration || 0;
                const expectedTime = containerWidth
                    ? (swipeDuration / containerWidth) * Math.abs(currentSwipeOffset)
                    : swipeDuration;

                if (count !== 0) {
                    if (elapsedTime < expectedTime) {
                        newSwipeAnimationDuration =
                            (newSwipeAnimationDuration / expectedTime) * Math.max(elapsedTime, expectedTime / 5);
                    } else if (containerWidth) {
                        newSwipeAnimationDuration =
                            (swipeDuration / containerWidth) * (containerWidth - Math.abs(currentSwipeOffset));
                    }
                } else {
                    newSwipeAnimationDuration = swipeDuration / 2;
                }

                if (count !== 0) {
                    direction = rtl(currentSwipeOffset) > 0 ? ACTION_PREV : ACTION_NEXT;
                }
            }

            let increment: number | undefined;
            if (direction === ACTION_PREV) {
                if (isSwipeValid(rtl(1))) {
                    increment = -count;
                } else {
                    newSwipeState = SwipeState.NONE;
                    newSwipeAnimationDuration = swipeDuration;
                }
            } else if (direction === ACTION_NEXT) {
                if (isSwipeValid(rtl(-1))) {
                    increment = count;
                } else {
                    newSwipeState = SwipeState.NONE;
                    newSwipeAnimationDuration = swipeDuration;
                }
            }

            if (carouselRef.current) {
                carouselSwipeAnimation.current = {
                    rect: carouselRef.current.getBoundingClientRect(),
                    index: state.globalIndex,
                };
            }

            newSwipeAnimationDuration = Math.round(newSwipeAnimationDuration);

            clearTimeout(swipeAnimationReset.current);
            if (newSwipeState) {
                const timeoutId = setTimeout(() => {
                    if (swipeAnimationReset.current === timeoutId) {
                        setSwipeOffset(0);
                        setSwipeState(SwipeState.NONE);
                    }
                }, newSwipeAnimationDuration);
                swipeAnimationReset.current = timeoutId;
            }

            setSwipeState(newSwipeState);

            dispatch({ increment, animationDuration: newSwipeAnimationDuration });
        }
    );

    const animateCarouselSwipe = useEventCallback(() => {
        const swipeAnimation = carouselSwipeAnimation.current;
        carouselSwipeAnimation.current = undefined;

        if (swipeAnimation && carouselRef.current && containerRect) {
            const parsedSpacing = parseLengthPercentage(carousel.spacing);
            const spacingValue =
                (parsedSpacing.percent ? (parsedSpacing.percent * containerRect.width) / 100 : parsedSpacing.pixel) ||
                0;

            carouselAnimation.current?.cancel();

            carouselAnimation.current = carouselRef.current.animate?.(
                [
                    {
                        transform: `translateX(${
                            rtl(state.globalIndex - swipeAnimation.index) * (containerRect.width + spacingValue) +
                            swipeAnimation.rect.x -
                            carouselRef.current.getBoundingClientRect().x
                        }px)`,
                    },
                    { transform: "translateX(0)" },
                ],
                !reduceMotion ? state.animationDuration : 0
            );

            if (carouselAnimation.current) {
                carouselAnimation.current.onfinish = () => {
                    carouselAnimation.current = undefined;
                };
            }
        }
    });

    useLayoutEffect(animateCarouselSwipe);

    const swipeParams = [
        subscribeSensors,
        isSwipeValid,
        containerRect?.width || 0,
        animation.swipe,
        () => setSwipeState(SwipeState.SWIPE), // onSwipeStart
        (offset: number) => setSwipeOffset(offset), // onSwipeProgress
        (offset: number, duration: number) => swipe({ offset, duration, count: 1 }), // onSwipeFinish
        (offset: number) => swipe({ offset, count: 0 }), // onSwipeCancel
    ] as const;

    usePointerSwipe(...swipeParams);

    useWheelSwipe(swipeState, ...swipeParams);

    const focusOnMount = useEventCallback(() => {
        if (controller.focus) {
            containerRef.current?.focus();
        }
    });

    React.useEffect(focusOnMount, [focusOnMount]);

    const handleIndexChange = useEventCallback(() => {
        on.view?.(state.currentIndex);
    });

    React.useEffect(handleIndexChange, [state.currentIndex, handleIndexChange]);

    React.useEffect(
        () =>
            cleanup(
                subscribe(ACTION_PREV, (count) =>
                    swipe({
                        direction: ACTION_PREV,
                        count: isNumber(count) ? count : undefined,
                    })
                ),
                subscribe(ACTION_NEXT, (count) =>
                    swipe({
                        direction: ACTION_NEXT,
                        count: isNumber(count) ? count : undefined,
                    })
                )
            ),
        [subscribe, swipe]
    );

    React.useEffect(
        () =>
            subscribeSensors(EVENT_ON_KEY_UP, (event: React.KeyboardEvent) => {
                if (event.code === VK_ESCAPE) {
                    publish(ACTION_CLOSE);
                }
            }),
        [subscribeSensors, publish]
    );

    React.useEffect(
        () =>
            controller.closeOnBackdropClick
                ? subscribe(YARL_EVENT_BACKDROP_CLICK, () => publish(ACTION_CLOSE))
                : () => {},
        [controller.closeOnBackdropClick, publish, subscribe]
    );

    const transferFocus = useEventCallback(() => containerRef.current?.focus());

    const getLightboxProps = useEventCallback(() => props);

    const context = React.useMemo<ControllerContextType>(
        () => ({
            getLightboxProps,
            subscribeSensors,
            transferFocus,
            // we are not going to render context provider when containerRect is undefined
            containerRect: containerRect || { width: 0, height: 0 },
            containerRef,
            setCarouselRef,
        }),
        [getLightboxProps, subscribeSensors, transferFocus, containerRect, containerRef, setCarouselRef]
    );

    return (
        <div
            ref={handleContainerRef}
            className={clsx(cssClass(cssContainerPrefix()), cssClass(CLASS_FLEX_CENTER))}
            style={{
                ...(swipeState === SwipeState.SWIPE
                    ? { [cssVar("swipe_offset")]: `${Math.round(swipeOffset.current)}px` }
                    : null),
                ...(controller.touchAction !== "none" ? {} : null),
                ...styles.container,
            }}
            {...(controller.aria ? { role: "presentation", "aria-live": "polite" } : null)}
            tabIndex={-1}
            {...registerSensors}
        >
            {containerRect && <ControllerContext.Provider value={context}>{children}</ControllerContext.Provider>}
        </div>
    );
};

export const ControllerModule = createModule(MODULE_CONTROLLER, Controller);
