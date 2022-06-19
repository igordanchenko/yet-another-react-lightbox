import * as React from "react";

import { Component, ComponentProps, LightboxDefaultProps } from "../../types.js";
import { cleanup, clsx, cssClass, cssVar, makeUseContext } from "../utils.js";
import { createModule } from "../config.js";
import {
    SubscribeSensors,
    useContainerRect,
    useEnhancedEffect,
    useLatest,
    useRTL,
    useSensors,
} from "../hooks/index.js";
import { useEvents, useTimeouts } from "../contexts/index.js";

const SWIPE_OFFSET_THRESHOLD = 30;

type ControllerState = {
    currentIndex: number;
    globalIndex: number;
};

export type ControllerContextType = ControllerState & {
    latestProps: React.MutableRefObject<ComponentProps>;
    subscribeSensors: SubscribeSensors<HTMLDivElement>;
};

const ControllerContext = React.createContext<ControllerContextType | null>(null);

export const useController = makeUseContext("useController", "ControllerContext", ControllerContext);

type ControllerRefs = {
    state: ControllerState;
    props: ComponentProps;
    swipeState?: "swipe" | "swipe-animation";
    swipeAnimationDuration: number;
    swipeOffset: number;
    swipeIntent: number;
    swipeStartTime?: number;
    swipeResetCleanup?: number;
    swipeIntentCleanup?: number;
    wheelResidualMomentum: number;
    pointers: React.PointerEvent[];
    activePointer?: number;
};

export const Controller: Component = ({ children, ...props }) => {
    const { containerRef, setContainerRef } = useContainerRect<HTMLDivElement>();
    const { registerSensors, subscribeSensors } = useSensors<HTMLDivElement>();
    const { subscribe, publish } = useEvents();
    const { setTimeout, clearTimeout } = useTimeouts();
    const isRTL = useLatest(useRTL());

    const [state, setState] = React.useState<ControllerState>({
        currentIndex: props.index,
        globalIndex: props.index,
    });

    const latestProps = useLatest(props);

    const refs = React.useRef<ControllerRefs>({
        state,
        props,
        swipeOffset: 0,
        swipeIntent: 0,
        swipeAnimationDuration: props.animation.swipe,
        wheelResidualMomentum: 0,
        pointers: [],
    });

    refs.current.state = state;
    refs.current.props = props;

    // prevent browser back/forward navigation on touchpad left/right swipe
    // this has to be done via non-passive native event handler
    useEnhancedEffect(() => {
        const preventDefault = (event: WheelEvent) => {
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
                event.preventDefault();
            }
        };

        const node = containerRef.current;
        if (node) {
            node.addEventListener("wheel", preventDefault, { passive: false });
        }

        return () => {
            if (node) {
                node.removeEventListener("wheel", preventDefault);
            }
        };
    }, [containerRef]);

    React.useEffect(() => {
        if (refs.current.props.controller.focus) {
            containerRef.current?.focus();
        }
    }, [containerRef, refs]);

    React.useEffect(() => {
        refs.current.props.on.view?.(state.currentIndex);
    }, [state.currentIndex]);

    const updateSwipeOffset = React.useCallback(() => {
        const offsetVar = cssVar("swipe_offset");
        if (refs.current.swipeOffset !== 0) {
            containerRef.current?.style.setProperty(offsetVar, `${Math.round(refs.current.swipeOffset)}px`);
        } else {
            containerRef.current?.style.removeProperty(offsetVar);
        }
    }, [containerRef]);

    useEnhancedEffect(() => {
        updateSwipeOffset();
    });

    const rerender = React.useCallback(() => {
        setState((prev) => ({ ...prev }));
    }, []);

    const resetSwipe = React.useCallback(() => {
        const { current } = refs;

        current.swipeOffset = 0;
        current.swipeIntent = 0;
        current.swipeStartTime = undefined;

        clearTimeout(current.swipeResetCleanup);
        current.swipeResetCleanup = undefined;

        clearTimeout(current.swipeIntentCleanup);
        current.swipeIntentCleanup = undefined;
    }, [clearTimeout]);

    const rtl = React.useCallback(
        (value?: number) => (isRTL.current ? -1 : 1) * (typeof value === "number" ? value : 1),
        [isRTL]
    );

    const isSwipeValid = React.useCallback(
        (offset: number) => {
            const {
                state: { currentIndex },
                props: { carousel, slides },
            } = refs.current;

            return !(
                carousel.finite &&
                ((rtl(offset) > 0 && currentIndex === 0) || (rtl(offset) < 0 && currentIndex === slides.length - 1))
            );
        },
        [rtl]
    );

    const swipe = React.useCallback(
        (direction?: "prev" | "next", count = 1) => {
            const { current } = refs;
            const slidesCount = current.props.slides.length;
            const swipeAnimationDuration = current.props.animation.swipe;
            const { currentIndex, globalIndex } = current.state;
            const { swipeOffset } = current;

            let newSwipeState: ControllerRefs["swipeState"] = "swipe-animation";
            let newSwipeAnimationDuration = swipeAnimationDuration * count;

            if (!direction) {
                const containerWidth = containerRef.current?.clientWidth;

                const elapsedTime = current.swipeStartTime ? Date.now() - current.swipeStartTime : 0;
                const expectedTime = containerWidth
                    ? (swipeAnimationDuration / containerWidth) * Math.abs(swipeOffset)
                    : swipeAnimationDuration;

                if (
                    containerWidth &&
                    ((swipeOffset !== 0 && elapsedTime < swipeAnimationDuration) ||
                        Math.abs(swipeOffset) > 0.5 * containerWidth)
                ) {
                    newSwipeAnimationDuration =
                        (swipeAnimationDuration / containerWidth) * (containerWidth - Math.abs(swipeOffset));

                    if (elapsedTime < expectedTime) {
                        newSwipeAnimationDuration =
                            (newSwipeAnimationDuration / expectedTime) * Math.max(elapsedTime, expectedTime / 5);
                    }

                    // eslint-disable-next-line no-param-reassign
                    direction = rtl(swipeOffset) > 0 ? "prev" : "next";
                } else {
                    newSwipeAnimationDuration = swipeAnimationDuration / 2;
                }
            }

            const newState: Partial<ControllerState> = {};
            if (direction === "prev") {
                if (isSwipeValid(rtl(1))) {
                    newState.currentIndex = (currentIndex - count + slidesCount) % slidesCount;
                    newState.globalIndex = globalIndex - count;
                } else {
                    newSwipeState = undefined;
                    newSwipeAnimationDuration = swipeAnimationDuration;
                }
            } else if (direction === "next") {
                if (isSwipeValid(rtl(-1))) {
                    newState.currentIndex = (currentIndex + count) % slidesCount;
                    newState.globalIndex = globalIndex + count;
                } else {
                    newSwipeState = undefined;
                    newSwipeAnimationDuration = swipeAnimationDuration;
                }
            }

            newSwipeAnimationDuration = Math.round(newSwipeAnimationDuration);

            resetSwipe();

            current.swipeState = newSwipeState;
            current.swipeAnimationDuration = newSwipeAnimationDuration;

            if (newSwipeState) {
                setTimeout(() => {
                    current.swipeState = undefined;
                    current.swipeAnimationDuration = current.props.animation.swipe;

                    rerender();
                }, newSwipeAnimationDuration);
            }

            publish("controller-swipe", { ...newState, animationDuration: current.swipeAnimationDuration });

            setState((prev) => ({ ...prev, ...newState }));
        },
        [setTimeout, resetSwipe, isSwipeValid, rerender, containerRef, rtl, publish]
    );

    React.useEffect(
        () =>
            cleanup(
                subscribe("prev", (_, count) => swipe("prev", typeof count === "number" ? count : undefined)),
                subscribe("next", (_, count) => swipe("next", typeof count === "number" ? count : undefined))
            ),
        [subscribe, swipe]
    );

    React.useEffect(
        () =>
            subscribeSensors("onKeyUp", (event: React.KeyboardEvent) => {
                if (event.code === "Escape") {
                    publish("close");
                }
            }),
        [subscribeSensors, publish]
    );

    const clearPointer = React.useCallback((event: React.PointerEvent) => {
        const { current } = refs;

        if (current.activePointer === event.pointerId) {
            current.activePointer = undefined;
        }

        current.pointers.splice(
            0,
            current.pointers.length,
            ...current.pointers.filter((p) => p.pointerId !== event.pointerId)
        );
    }, []);

    const addPointer = React.useCallback(
        (event: React.PointerEvent) => {
            clearPointer(event);
            refs.current.pointers.push(event);
        },
        [clearPointer]
    );

    const onPointerDown = React.useCallback(
        (event: React.PointerEvent) => {
            addPointer(event);
        },
        [addPointer]
    );

    const onPointerMove = React.useCallback(
        (event: React.PointerEvent) => {
            const { current } = refs;
            const original = current.pointers.find((p) => p.pointerId === event.pointerId);
            if (original) {
                const deltaX = event.clientX - original.clientX;
                const deltaY = event.clientY - original.clientY;

                if (!current.swipeState) {
                    if (
                        isSwipeValid(deltaX) &&
                        Math.abs(deltaX) > Math.abs(deltaY) &&
                        Math.abs(deltaX) > SWIPE_OFFSET_THRESHOLD
                    ) {
                        addPointer(event);

                        current.activePointer = event.pointerId;
                        current.swipeStartTime = Date.now();

                        current.swipeState = "swipe";

                        rerender();
                    }
                } else if (current.swipeState === "swipe") {
                    if (event.pointerId === current.activePointer) {
                        current.swipeOffset = deltaX;

                        updateSwipeOffset();
                    }
                }
            }
        },
        [addPointer, updateSwipeOffset, isSwipeValid, rerender]
    );

    const onPointerUp = React.useCallback(
        (event: React.PointerEvent) => {
            const { current } = refs;

            if (
                current.pointers.find((p) => p.pointerId === event.pointerId) &&
                current.swipeState === "swipe" &&
                current.activePointer === event.pointerId
            ) {
                swipe();
            }

            clearPointer(event);
        },
        [clearPointer, swipe]
    );

    React.useEffect(
        () =>
            cleanup(
                subscribeSensors("onPointerDown", onPointerDown),
                subscribeSensors("onPointerMove", onPointerMove),
                subscribeSensors("onPointerUp", onPointerUp),
                subscribeSensors("onPointerLeave", onPointerUp),
                subscribeSensors("onPointerCancel", onPointerUp)
            ),
        [subscribeSensors, onPointerDown, onPointerMove, onPointerUp]
    );

    const onWheel = React.useCallback(
        (event: React.WheelEvent) => {
            if (event.ctrlKey) {
                // zoom
                return;
            }

            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                // pan-y
                return;
            }

            const { current } = refs;
            if (!current.swipeState) {
                if (Math.abs(event.deltaX) <= 1.2 * Math.abs(current.wheelResidualMomentum)) {
                    current.wheelResidualMomentum = event.deltaX;
                    return;
                }

                if (!isSwipeValid(-event.deltaX)) {
                    return;
                }

                current.swipeIntent += event.deltaX;
                clearTimeout(current.swipeIntentCleanup);

                if (Math.abs(current.swipeIntent) > SWIPE_OFFSET_THRESHOLD) {
                    current.swipeStartTime = Date.now();
                    current.swipeIntent = 0;
                    current.wheelResidualMomentum = 0;

                    current.swipeState = "swipe";

                    rerender();
                } else {
                    current.swipeIntentCleanup = setTimeout(() => {
                        current.swipeIntent = 0;
                        current.swipeIntentCleanup = undefined;
                    }, current.props.animation.swipe);
                }
            } else if (current.swipeState === "swipe") {
                const containerWidth = containerRef.current?.clientWidth;

                if (containerWidth) {
                    current.swipeOffset -= event.deltaX;
                    current.swipeOffset =
                        Math.min(Math.abs(current.swipeOffset), containerWidth) * Math.sign(current.swipeOffset);

                    updateSwipeOffset();

                    clearTimeout(current.swipeResetCleanup);

                    if (Math.abs(current.swipeOffset) > 0.2 * containerWidth) {
                        current.wheelResidualMomentum = event.deltaX;
                        swipe();
                        return;
                    }

                    const currentSwipeOffset = current.swipeOffset;
                    current.swipeResetCleanup = setTimeout(() => {
                        current.swipeResetCleanup = undefined;
                        if (current.swipeState === "swipe" && current.swipeOffset === currentSwipeOffset) {
                            resetSwipe();

                            current.swipeState = undefined;

                            rerender();
                        }
                    }, 2 * current.props.animation.swipe);
                }
            } else {
                current.wheelResidualMomentum = event.deltaX;
            }
        },
        [updateSwipeOffset, setTimeout, clearTimeout, swipe, resetSwipe, rerender, isSwipeValid, containerRef]
    );

    React.useEffect(() => subscribeSensors("onWheel", onWheel), [subscribeSensors, onWheel]);

    const context = React.useMemo(
        () => ({
            latestProps,
            currentIndex: state.currentIndex,
            globalIndex: state.globalIndex,
            subscribeSensors,
        }),
        [latestProps, state.currentIndex, state.globalIndex, subscribeSensors]
    );

    return (
        <div
            ref={setContainerRef}
            className={clsx(
                cssClass("container"),
                cssClass("fullsize"),
                refs.current.swipeState === "swipe" && cssClass("container_swipe")
            )}
            style={{
                ...(refs.current.swipeAnimationDuration !== LightboxDefaultProps.animation.swipe
                    ? {
                          [cssVar("swipe_animation_duration")]: `${Math.round(refs.current.swipeAnimationDuration)}ms`,
                      }
                    : null),
                ...(props.controller.touchAction !== "none"
                    ? {
                          [cssVar("controller_touch_action")]: props.controller.touchAction,
                      }
                    : null),
            }}
            role="presentation"
            aria-live="polite"
            tabIndex={-1}
            {...registerSensors}
        >
            <ControllerContext.Provider value={context}>{children}</ControllerContext.Provider>
        </div>
    );
};

export const ControllerModule = createModule("controller", Controller);
