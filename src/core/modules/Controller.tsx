import * as React from "react";

import { Callback, ComponentProps, ContainerRect, ControllerRef, NavigationAction } from "../../types.js";
import { createModule } from "../config.js";
import {
    cleanup,
    clsx,
    computeSlideRect,
    cssClass,
    cssVar,
    isNumber,
    makeComposePrefix,
    makeUseContext,
    parseLengthPercentage,
} from "../utils.js";
import {
    SubscribeSensors,
    useAnimation,
    useContainerRect,
    useDelay,
    useEventCallback,
    useForkRef,
    useRTL,
    useSensors,
} from "../hooks/index.js";
import { LightboxStateSwipeAction, useEvents, useLightboxState } from "../contexts/index.js";
import { SwipeState, usePointerSwipe, usePreventSwipeNavigation, useWheelSwipe } from "./controller/index.js";
import {
    ACTION_CLOSE,
    ACTION_NEXT,
    ACTION_PREV,
    ACTION_SWIPE,
    CLASS_FLEX_CENTER,
    EVENT_ON_KEY_UP,
    MODULE_CONTROLLER,
    VK_ESCAPE,
} from "../consts.js";

declare module "../index.js" {
    // noinspection JSUnusedGlobalSymbols
    interface EventTypes {
        [ACTION_PREV]: NavigationAction | void;
        [ACTION_NEXT]: NavigationAction | void;
        [ACTION_SWIPE]: LightboxStateSwipeAction;
        [ACTION_CLOSE]: void;
    }
}

const cssContainerPrefix = makeComposePrefix("container");

export type ControllerContextType = Pick<ControllerRef, "prev" | "next" | "close"> & {
    focus: Callback;
    slideRect: ContainerRect;
    containerRect: ContainerRect;
    subscribeSensors: SubscribeSensors<HTMLDivElement>;
    containerRef: React.RefObject<HTMLDivElement>;
    setCarouselRef: React.Ref<HTMLDivElement>;
    toolbarWidth: number | undefined;
    setToolbarWidth: (width: number | undefined) => void;
};

export const ControllerContext = React.createContext<ControllerContextType | null>(null);

export const useController = makeUseContext("useController", "ControllerContext", ControllerContext);

export function Controller({ children, ...props }: ComponentProps) {
    const { carousel, animation, controller, on, styles, render } = props;

    const [toolbarWidth, setToolbarWidth] = React.useState<number>();

    const { state, dispatch } = useLightboxState();

    const [swipeState, setSwipeState] = React.useState(SwipeState.NONE);
    const swipeOffset = React.useRef(0);

    const { registerSensors, subscribeSensors } = useSensors<HTMLDivElement>();
    const { subscribe, publish } = useEvents();

    const cleanupAnimationIncrement = useDelay();
    const cleanupSwipeOffset = useDelay();

    const { containerRef, setContainerRef, containerRect } = useContainerRect<HTMLDivElement>();
    const handleContainerRef = useForkRef(usePreventSwipeNavigation(), setContainerRef);

    const carouselRef = React.useRef<HTMLDivElement | null>(null);
    const setCarouselRef = useForkRef(carouselRef, undefined);

    const isRTL = useRTL();

    const rtl = (value?: number) => (isRTL ? -1 : 1) * (isNumber(value) ? value : 1);

    const focus = useEventCallback(() => containerRef.current?.focus());

    const getLightboxProps = useEventCallback(() => props);
    const getLightboxState = useEventCallback(() => state);

    const prev: ControllerRef["prev"] = React.useCallback((params) => publish(ACTION_PREV, params), [publish]);
    const next: ControllerRef["next"] = React.useCallback((params) => publish(ACTION_NEXT, params), [publish]);
    const close: ControllerRef["close"] = React.useCallback(() => publish(ACTION_CLOSE), [publish]);

    const isSwipeValid = (offset: number) =>
        !(
            carousel.finite &&
            ((rtl(offset) > 0 && state.currentIndex === 0) ||
                (rtl(offset) < 0 && state.currentIndex === state.slides.length - 1))
        );

    const setSwipeOffset = (offset: number) => {
        swipeOffset.current = offset;

        containerRef.current?.style.setProperty(cssVar("swipe_offset"), `${Math.round(offset)}px`);
    };

    const { prepareAnimation, isAnimationPlaying } = useAnimation<{ rect: DOMRect; index: number }>(
        carouselRef,
        (snapshot, rect, translate) => {
            if (carouselRef.current && containerRect && state.animation?.duration) {
                const parsedSpacing = parseLengthPercentage(carousel.spacing);
                const spacingValue =
                    (parsedSpacing.percent
                        ? (parsedSpacing.percent * containerRect.width) / 100
                        : parsedSpacing.pixel) || 0;

                return {
                    keyframes: [
                        {
                            transform: `translateX(${
                                rtl(state.globalIndex - snapshot.index) * (containerRect.width + spacingValue) +
                                snapshot.rect.x -
                                rect.x +
                                translate.x
                            }px)`,
                        },
                        { transform: "translateX(0)" },
                    ],
                    duration: state.animation.duration,
                    easing: state.animation.easing,
                };
            }
            return undefined;
        }
    );

    const swipe = useEventCallback(
        (action: { direction?: "prev" | "next"; count?: number; offset?: number; duration?: number }) => {
            const currentSwipeOffset = action.offset || 0;
            const swipeDuration = !currentSwipeOffset ? animation.navigation ?? animation.swipe : animation.swipe;
            const swipeEasing =
                !currentSwipeOffset && !isAnimationPlaying() ? animation.easing.navigation : animation.easing.swipe;

            let { direction } = action;
            const count = action.count ?? 1;

            let newSwipeState = SwipeState.ANIMATION;
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

                    direction = rtl(currentSwipeOffset) > 0 ? ACTION_PREV : ACTION_NEXT;
                } else {
                    newSwipeAnimationDuration = swipeDuration / 2;
                }
            }

            let increment = 0;
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

            newSwipeAnimationDuration = Math.round(newSwipeAnimationDuration);

            cleanupSwipeOffset(() => {
                setSwipeOffset(0);
                setSwipeState(SwipeState.NONE);
            }, newSwipeAnimationDuration);

            if (carouselRef.current) {
                prepareAnimation({
                    rect: carouselRef.current.getBoundingClientRect(),
                    index: state.globalIndex,
                });
            }

            setSwipeState(newSwipeState);

            publish(ACTION_SWIPE, {
                type: "swipe",
                increment,
                duration: newSwipeAnimationDuration,
                easing: swipeEasing,
            });
        }
    );

    React.useEffect(() => {
        if (state.animation?.increment && state.animation?.duration) {
            cleanupAnimationIncrement(() => dispatch({ type: "swipe", increment: 0 }), state.animation.duration);
        }
    }, [state.animation, dispatch, cleanupAnimationIncrement]);

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

    const onViewCallback = useEventCallback(() => {
        on.view?.({ index: state.currentIndex });
    });

    React.useEffect(onViewCallback, [state.globalIndex, onViewCallback]);

    React.useEffect(
        () =>
            cleanup(
                subscribe(ACTION_PREV, (action) => swipe({ direction: ACTION_PREV, ...action })),
                subscribe(ACTION_NEXT, (action) => swipe({ direction: ACTION_NEXT, ...action })),
                subscribe(ACTION_SWIPE, (action) => dispatch(action))
            ),
        [subscribe, swipe, dispatch]
    );

    React.useEffect(
        () =>
            subscribeSensors(EVENT_ON_KEY_UP, (event: React.KeyboardEvent) => {
                if (event.code === VK_ESCAPE) {
                    close();
                }
            }),
        [subscribeSensors, close]
    );

    const context = React.useMemo<ControllerContextType>(
        () => ({
            prev,
            next,
            close,
            focus,
            // we are not going to render context provider when containerRect is undefined
            slideRect: containerRect ? computeSlideRect(containerRect, carousel.padding) : { width: 0, height: 0 },
            containerRect: containerRect || { width: 0, height: 0 },
            subscribeSensors,
            containerRef,
            setCarouselRef,
            toolbarWidth,
            setToolbarWidth,
        }),
        [
            prev,
            next,
            close,
            focus,
            subscribeSensors,
            containerRect,
            containerRef,
            setCarouselRef,
            toolbarWidth,
            setToolbarWidth,
            carousel.padding,
        ]
    );

    React.useImperativeHandle(
        controller.ref,
        () => ({
            prev,
            next,
            close,
            focus,
            getLightboxProps,
            getLightboxState,
        }),
        [prev, next, close, focus, getLightboxProps, getLightboxState]
    );

    return (
        <div
            ref={handleContainerRef}
            className={clsx(cssClass(cssContainerPrefix()), cssClass(CLASS_FLEX_CENTER))}
            style={{
                ...(swipeState === SwipeState.SWIPE
                    ? { [cssVar("swipe_offset")]: `${Math.round(swipeOffset.current)}px` }
                    : null),
                ...(controller.touchAction !== "none"
                    ? { [cssVar("controller_touch_action")]: controller.touchAction }
                    : null),
                ...styles.container,
            }}
            {...(controller.aria ? { role: "presentation", "aria-live": "polite" } : null)}
            tabIndex={-1}
            {...registerSensors}
        >
            {containerRect && (
                <ControllerContext.Provider value={context}>
                    {children}
                    {render.controls?.()}
                </ControllerContext.Provider>
            )}
        </div>
    );
}

export const ControllerModule = createModule(MODULE_CONTROLLER, Controller);
