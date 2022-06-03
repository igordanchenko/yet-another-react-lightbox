import * as React from "react";

import { Component, ComponentProps, LightboxDefaultProps } from "../../types.js";
import { cleanup, clsx, cssClass, cssVar, makeUseContext } from "../utils.js";
import { createModule } from "../config.js";
import { ContainerRect, SubscribeSensors, useContainerRect, useEnhancedEffect, useSensors } from "../hooks/index.js";
import { useEvents, useTimeouts } from "../contexts/index.js";

const SWIPE_OFFSET_THRESHOLD = 30;

export type ControllerContextType = {
    containerRef: React.RefObject<HTMLDivElement>;
    containerRect: ContainerRect;
    currentIndex: number;
    globalIndex: number;
    subscribeSensors: SubscribeSensors<HTMLDivElement>;
};

const ControllerContext = React.createContext<ControllerContextType | null>(null);

export const useController = makeUseContext("useController", "ControllerContext", ControllerContext);

type ControllerState = {
    currentIndex: number;
    globalIndex: number;
};

type ControllerRefs = {
    state: ControllerState;
    props: ComponentProps;
    containerRect?: ContainerRect;
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
    const { containerRef, setContainerRef, containerRect } = useContainerRect<HTMLDivElement>();
    const { registerSensors, subscribeSensors } = useSensors<HTMLDivElement>();
    const { subscribe, publish } = useEvents();
    const { setTimeout, clearTimeout } = useTimeouts();

    const [state, setState] = React.useState<ControllerState>({
        currentIndex: props.index,
        globalIndex: props.index,
    });

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
    refs.current.containerRect = containerRect;

    // prevent browser back/forward navigation on touchpad left/right swipe
    // this has to be done via non-passive native event handler
    useEnhancedEffect(() => {
        const preventDefault = (event: Event) => event.preventDefault();

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

    const isSwipeValid = React.useCallback((offset: number) => {
        const {
            state: { currentIndex },
            props: { carousel, slides },
        } = refs.current;

        return !(
            carousel.finite &&
            ((offset > 0 && currentIndex === 0) || (offset < 0 && currentIndex === slides.length - 1))
        );
    }, []);

    const swipe = React.useCallback(
        (direction?: "prev" | "next") => {
            const { current } = refs;
            const slidesCount = current.props.slides.length;
            const swipeAnimationDuration = current.props.animation.swipe;
            const { currentIndex, globalIndex } = current.state;
            const { swipeOffset } = current;

            let newSwipeState: ControllerRefs["swipeState"] = "swipe-animation";
            let newSwipeAnimationDuration = swipeAnimationDuration;

            if (!direction) {
                const containerWidth = current.containerRect?.width;

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
                    direction = swipeOffset > 0 ? "prev" : "next";
                } else {
                    newSwipeAnimationDuration = swipeAnimationDuration / 2;
                }
            }

            const newState: Partial<ControllerState> = {};
            if (direction === "prev") {
                if (isSwipeValid(1)) {
                    newState.currentIndex = (currentIndex - 1 + slidesCount) % slidesCount;
                    newState.globalIndex = globalIndex - 1;
                } else {
                    newSwipeState = undefined;
                    newSwipeAnimationDuration = swipeAnimationDuration;
                }
            } else if (direction === "next") {
                if (isSwipeValid(-1)) {
                    newState.currentIndex = (currentIndex + 1) % slidesCount;
                    newState.globalIndex = globalIndex + 1;
                } else {
                    newSwipeState = undefined;
                    newSwipeAnimationDuration = swipeAnimationDuration;
                }
            }

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

            setState((prev) => ({ ...prev, ...newState }));
        },
        [setTimeout, resetSwipe, isSwipeValid, rerender]
    );

    React.useEffect(
        () =>
            cleanup(
                subscribe("prev", () => swipe("prev")),
                subscribe("next", () => swipe("next"))
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
                const containerWidth = current.containerRect?.width;

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
        [updateSwipeOffset, setTimeout, clearTimeout, swipe, resetSwipe, rerender, isSwipeValid]
    );

    React.useEffect(() => subscribeSensors("onWheel", onWheel), [subscribeSensors, onWheel]);

    const context = React.useMemo(
        () => ({
            containerRef,
            containerRect,
            currentIndex: state.currentIndex,
            globalIndex: state.globalIndex,
            subscribeSensors,
        }),
        [containerRef, containerRect, state.currentIndex, state.globalIndex, subscribeSensors]
    );

    return (
        <div
            ref={setContainerRef}
            className={clsx(cssClass("container"), refs.current.swipeState === "swipe" && cssClass("container_swipe"))}
            style={
                refs.current.swipeAnimationDuration !== LightboxDefaultProps.animation.swipe
                    ? ({
                          [cssVar("swipe_animation_duration")]: `${Math.round(refs.current.swipeAnimationDuration)}ms`,
                      } as React.CSSProperties)
                    : undefined
            }
            role="presentation"
            aria-live="polite"
            tabIndex={-1}
            {...registerSensors}
        >
            {containerRect && (
                <ControllerContext.Provider value={context as ControllerContextType}>
                    {children}
                </ControllerContext.Provider>
            )}
        </div>
    );
};

export const ControllerModule = createModule("controller", Controller);
