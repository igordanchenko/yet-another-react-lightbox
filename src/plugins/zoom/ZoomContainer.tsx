import * as React from "react";

import {
    cleanup,
    clsx,
    ContainerRect,
    cssClass,
    ImageSlide,
    isImageSlide,
    round,
    useContainerRect,
    useController,
    useEvents,
    useLayoutEffect,
    useMotionPreference,
} from "../../core/index.js";
import { DeepNonNullable, LightboxProps, Slide } from "../../types.js";
import { useZoom } from "./ZoomContext.js";
import { defaultZoomProps } from "./Zoom.js";

const getSlideRects = (slide: Slide, cover: boolean, maxZoomPixelRatio: number, rect?: ContainerRect) => {
    let slideRect: ContainerRect = { width: 0, height: 0 };
    let maxSlideRect: ContainerRect = { width: 0, height: 0 };

    if (rect && isImageSlide(slide)) {
        const width = Math.max(...(slide.srcSet?.map((x) => x.width) || []).concat(slide.width ? [slide.width] : []));

        const height = Math.max(
            ...(slide.srcSet?.map((x) => x.height) || []).concat(slide.height ? [slide.height] : [])
        );

        if (width > 0 && height > 0 && rect.width > 0 && rect.height > 0) {
            maxSlideRect = cover
                ? {
                      width: Math.round(Math.min(width, (rect.width / rect.height) * height)),
                      height: Math.round(Math.min(height, (rect.height / rect.width) * width)),
                  }
                : { width, height };

            maxSlideRect = {
                width: maxSlideRect.width * maxZoomPixelRatio,
                height: maxSlideRect.height * maxZoomPixelRatio,
            };

            slideRect = cover
                ? {
                      width: Math.min(rect.width, maxSlideRect.width),
                      height: Math.min(rect.height, maxSlideRect.height),
                  }
                : {
                      width: Math.round(Math.min(rect.width, (rect.height / height) * width)),
                      height: Math.round(Math.min(rect.height, (rect.width / width) * height)),
                  };
        }
    }

    return { slideRect, maxSlideRect };
};

const distance = (pointerA: React.MouseEvent, pointerB: React.MouseEvent) =>
    ((pointerA.clientX - pointerB.clientX) ** 2 + (pointerA.clientY - pointerB.clientY) ** 2) ** 0.5;

type ZoomContainerState = {
    zoom: number;
    offsetX: number;
    offsetY: number;
};

type ZoomContainerRefs = {
    state: ZoomContainerState;
    slideRect: ContainerRect;
    containerRef: React.MutableRefObject<HTMLElement | null>;
    controllerRef: React.MutableRefObject<HTMLElement | null>;
    containerRect?: ContainerRect;
    controllerRect?: ContainerRect;
    maxZoom: number;
    zoomAnimation?: Animation;
    zoomAnimationStart?: CSSStyleDeclaration["transform"];
    zoomAnimationDuration?: number;
    pinchZoomDistance?: number;
    reduceMotion: boolean;
    activePointers: React.PointerEvent[];
    lastPointerDown: number;
    zoomProps: DeepNonNullable<LightboxProps["zoom"]>;
};

/** Zoom container */
export const ZoomContainer: React.FC<
    Pick<LightboxProps, "render" | "carousel" | "zoom" | "animation"> & {
        slide: Slide;
        offset: number;
        rect: ContainerRect;
    }
> = ({ slide, offset, rect, render, carousel, animation, zoom: originalZoomProps }) => {
    const zoomProps = { ...defaultZoomProps, ...originalZoomProps };

    const { isMinZoom, isMaxZoom, setIsMinZoom, setIsMaxZoom } = useZoom();

    const {
        setContainerRef,
        containerRef: currentContainerRef,
        containerRect: currentContainerRect,
    } = useContainerRect();

    const {
        subscribeSensors,
        containerRef: currentControllerRef,
        containerRect: currentControllerRect,
    } = useController();

    const { subscribe } = useEvents();

    const currentReduceMotion = useMotionPreference();

    const { slideRect: currentSlideRect, maxSlideRect: currentMaxSlideRect } = getSlideRects(
        slide,
        carousel.imageFit === "cover" || ("imageFit" in slide && slide.imageFit === "cover"),
        zoomProps.maxZoomPixelRatio,
        currentContainerRect
    );

    const currentMaxZoom = currentSlideRect.width
        ? Math.max(round(currentMaxSlideRect.width / currentSlideRect.width, 5), 1)
        : 1;

    const [state, setState] = React.useState<ZoomContainerState>({ zoom: 1, offsetX: 0, offsetY: 0 });

    const refs = React.useRef<ZoomContainerRefs>({
        state,
        slideRect: currentSlideRect,
        containerRef: currentContainerRef,
        controllerRef: currentControllerRef,
        containerRect: currentContainerRect,
        controllerRect: currentControllerRect,
        maxZoom: currentMaxZoom,
        reduceMotion: currentReduceMotion,
        activePointers: [],
        lastPointerDown: 0,
        zoomProps,
    });

    refs.current.state = state;
    refs.current.slideRect = currentSlideRect;
    refs.current.containerRef = currentContainerRef;
    refs.current.controllerRef = currentControllerRef;
    refs.current.containerRect = currentContainerRect;
    refs.current.controllerRect = currentControllerRect;
    refs.current.maxZoom = currentMaxZoom;
    refs.current.reduceMotion = currentReduceMotion;
    refs.current.zoomAnimationDuration = animation.zoom;
    refs.current.zoomProps = zoomProps;

    const changeOffsets = React.useCallback((dx?: number, dy?: number, newZoom?: number) => {
        const {
            state: { zoom, offsetX, offsetY },
            containerRect,
            slideRect,
        } = refs.current;

        const targetZoom = newZoom || zoom;
        const newOffsetX = offsetX - (dx || 0);
        const newOffsetY = offsetY - (dy || 0);

        const maxOffsetX = containerRect ? (slideRect.width * targetZoom - containerRect.width) / 2 / targetZoom : 0;
        const maxOffsetY = containerRect ? (slideRect.height * targetZoom - containerRect.height) / 2 / targetZoom : 0;

        setState((prev) => ({
            ...prev,
            offsetX: Math.min(Math.abs(newOffsetX), Math.max(maxOffsetX, 0)) * Math.sign(newOffsetX),
            offsetY: Math.min(Math.abs(newOffsetY), Math.max(maxOffsetY, 0)) * Math.sign(newOffsetY),
        }));
    }, []);

    const changeZoom = React.useCallback(
        (value: number, rapid?: boolean, dx?: number, dy?: number) => {
            const { current } = refs;
            const {
                state: { zoom },
                containerRef,
                containerRect,
                maxZoom,
            } = current;

            if (!containerRef.current || !containerRect) return;

            const newZoom = round(Math.min(Math.max(value + 0.001 < maxZoom ? value : maxZoom, 1), maxZoom), 5);

            if (newZoom === zoom) return;

            if (!rapid) {
                current.zoomAnimationStart = window.getComputedStyle(containerRef.current).transform;
            }

            changeOffsets(dx ? dx * (1 / zoom - 1 / newZoom) : 0, dy ? dy * (1 / zoom - 1 / newZoom) : 0, newZoom);

            setState((prev) => ({ ...prev, zoom: newZoom }));
        },
        [changeOffsets]
    );

    useLayoutEffect(() => {
        if (refs.current.state.zoom > 1) {
            const {
                maxZoom,
                state: { zoom: currentZoom },
            } = refs.current;

            if (currentZoom > maxZoom) {
                changeZoom(maxZoom, true);
            }

            changeOffsets();
        }
    }, [currentControllerRect.width, currentControllerRect.height, changeOffsets, changeZoom]);

    useLayoutEffect(() => {
        const { current } = refs;
        const { zoomAnimation, zoomAnimationStart, zoomAnimationDuration, reduceMotion, containerRef } = current;

        zoomAnimation?.cancel();

        if (zoomAnimationStart && containerRef.current) {
            current.zoomAnimation = containerRef.current.animate?.(
                [
                    { transform: zoomAnimationStart },
                    {
                        transform: `scale(${state.zoom}) translate3d(${state.offsetX}px, ${state.offsetY}px, 0)`,
                    },
                ],
                {
                    duration: reduceMotion ? 0 : zoomAnimationDuration ?? 500,
                    easing: zoomAnimation ? "ease-out" : "ease-in-out",
                }
            );

            current.zoomAnimationStart = undefined;

            if (current.zoomAnimation) {
                current.zoomAnimation.onfinish = () => {
                    current.zoomAnimation = undefined;
                };
            }
        }
    }, [state.zoom, state.offsetX, state.offsetY]);

    useLayoutEffect(() => {
        if (offset === 0) {
            const resetZoom = () => {
                setState({ zoom: 1, offsetX: 0, offsetY: 0 });

                setIsMinZoom(true);
                setIsMaxZoom(false);
            };

            resetZoom();

            return () => {
                resetZoom();
            };
        }

        return () => {};
    }, [offset, setIsMinZoom, setIsMaxZoom]);

    useLayoutEffect(() => {
        if (offset === 0) {
            const newMinZoom = state.zoom <= 1;
            if (newMinZoom !== isMinZoom) {
                setIsMinZoom(newMinZoom);
            }

            const newMaxZoom = state.zoom >= currentMaxZoom;
            if (newMaxZoom !== isMaxZoom) {
                setIsMaxZoom(newMaxZoom);
            }
        }
    }, [offset, state.zoom, currentMaxZoom, isMinZoom, isMaxZoom, setIsMinZoom, setIsMaxZoom]);

    const translateCoordinates = React.useCallback((event: React.MouseEvent) => {
        const { controllerRef } = refs.current;
        if (controllerRef.current) {
            const { pageX, pageY } = event;
            const { scrollX, scrollY } = window;
            const { left, top, width, height } = controllerRef.current.getBoundingClientRect();
            return [pageX - left - scrollX - width / 2, pageY - top - scrollY - height / 2];
        }
        return [];
    }, []);

    const onKeyDown = React.useCallback(
        (event: React.KeyboardEvent) => {
            const {
                state: { zoom },
                zoomProps: { keyboardMoveDistance, zoomInMultiplier },
            } = refs.current;

            const preventDefault = () => {
                event.preventDefault();
                event.stopPropagation();
            };

            if (zoom > 1) {
                const move = (deltaX: number, deltaY: number) => {
                    preventDefault();
                    changeOffsets(deltaX, deltaY);
                };

                if (event.key === "ArrowDown") {
                    move(0, keyboardMoveDistance);
                } else if (event.key === "ArrowUp") {
                    move(0, -keyboardMoveDistance);
                } else if (event.key === "ArrowLeft") {
                    move(-keyboardMoveDistance, 0);
                } else if (event.key === "ArrowRight") {
                    move(keyboardMoveDistance, 0);
                }
            }

            const handleChangeZoom = (zoomValue: number) => {
                preventDefault();
                changeZoom(zoomValue);
            };

            const hasMeta = () => event.getModifierState("Meta") || event.getModifierState("OS");

            if (event.key === "+" || (event.key === "=" && hasMeta())) {
                handleChangeZoom(zoom * zoomInMultiplier);
            } else if (event.key === "-" || (event.key === "_" && hasMeta())) {
                handleChangeZoom(zoom / zoomInMultiplier);
            } else if (event.key === "0" && hasMeta()) {
                handleChangeZoom(1);
            }
        },
        [changeZoom, changeOffsets]
    );

    const onWheel = React.useCallback(
        (event: React.WheelEvent) => {
            const {
                state: { zoom },
                zoomProps: { wheelZoomDistanceFactor, scrollToZoom },
            } = refs.current;

            if (event.ctrlKey || scrollToZoom) {
                if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                    event.stopPropagation();

                    changeZoom(
                        zoom * (1 - event.deltaY / wheelZoomDistanceFactor),
                        true,
                        ...translateCoordinates(event)
                    );

                    return;
                }
            }

            if (zoom > 1) {
                event.stopPropagation();

                if (!scrollToZoom) {
                    changeOffsets(event.deltaX, event.deltaY);
                }
            }
        },
        [changeZoom, changeOffsets, translateCoordinates]
    );

    const clearPointer = React.useCallback((event: React.PointerEvent) => {
        const { activePointers } = refs.current;

        activePointers.splice(
            0,
            activePointers.length,
            ...activePointers.filter((p) => p.pointerId !== event.pointerId)
        );
    }, []);

    const replacePointer = React.useCallback(
        (event: React.PointerEvent) => {
            clearPointer(event);

            refs.current.activePointers.push(event);
        },
        [clearPointer]
    );

    const onPointerDown = React.useCallback(
        (event: React.PointerEvent) => {
            const { current } = refs;
            const {
                state: { zoom },
                containerRef,
                activePointers,
                lastPointerDown,
                maxZoom,
                zoomProps: { doubleTapDelay, doubleClickDelay, zoomInMultiplier, doubleClickMaxStops },
            } = current;

            if (!containerRef.current?.contains(event.target as unknown as Element)) {
                return;
            }

            if (zoom > 1) {
                event.stopPropagation();
            }

            const { timeStamp } = event;
            if (
                activePointers.length === 0 &&
                timeStamp - lastPointerDown < (event.pointerType === "touch" ? doubleTapDelay : doubleClickDelay)
            ) {
                current.lastPointerDown = 0;
                changeZoom(
                    zoom !== maxZoom ? zoom * Math.max(maxZoom ** (1 / doubleClickMaxStops), zoomInMultiplier) : 1,
                    false,
                    ...translateCoordinates(event)
                );
            } else {
                current.lastPointerDown = timeStamp;
            }

            replacePointer(event);

            if (activePointers.length === 2) {
                current.pinchZoomDistance = distance(activePointers[0], activePointers[1]);
            }
        },
        [changeZoom, replacePointer, translateCoordinates]
    );

    const onPointerMove = React.useCallback(
        (event: React.PointerEvent) => {
            const { current } = refs;
            const {
                state: { zoom },
                activePointers,
                pinchZoomDistance,
                zoomProps: { pinchZoomDistanceFactor },
            } = current;

            const activePointer = activePointers.find((p) => p.pointerId === event.pointerId);

            if (activePointers.length === 2 && pinchZoomDistance) {
                event.stopPropagation();

                replacePointer(event);

                const currentDistance = distance(activePointers[0], activePointers[1]);
                const delta = currentDistance - pinchZoomDistance;

                if (Math.abs(delta) > 0) {
                    changeZoom(
                        zoom * (1 + delta / pinchZoomDistanceFactor),
                        true,
                        ...activePointers
                            .map((x) => translateCoordinates(x))
                            .reduce((acc, coordinate) => coordinate.map((x, i) => acc[i] + x / 2))
                    );

                    current.pinchZoomDistance = currentDistance;
                }

                return;
            }

            if (zoom > 1) {
                event.stopPropagation();

                if (activePointer) {
                    if (activePointers.length === 1) {
                        changeOffsets(
                            (activePointer.clientX - event.clientX) / zoom,
                            (activePointer.clientY - event.clientY) / zoom
                        );
                    }

                    replacePointer(event);
                }
            }
        },
        [changeOffsets, replacePointer, changeZoom, translateCoordinates]
    );

    const onPointerUp = React.useCallback(
        (event: React.PointerEvent) => {
            const { current } = refs;
            const { activePointers } = current;

            if (activePointers.length === 2 && activePointers.find((p) => p.pointerId === event.pointerId)) {
                current.pinchZoomDistance = undefined;
            }

            clearPointer(event);
        },
        [clearPointer]
    );

    React.useEffect(
        () =>
            offset === 0
                ? cleanup(
                      subscribe("zoom-in", () =>
                          changeZoom(refs.current.state.zoom * refs.current.zoomProps.zoomInMultiplier)
                      ),
                      subscribe("zoom-out", () =>
                          changeZoom(refs.current.state.zoom / refs.current.zoomProps.zoomInMultiplier)
                      ),
                      subscribeSensors("onKeyDown", onKeyDown),
                      subscribeSensors("onWheel", onWheel),
                      subscribeSensors("onPointerDown", onPointerDown),
                      subscribeSensors("onPointerMove", onPointerMove),
                      subscribeSensors("onPointerUp", onPointerUp),
                      subscribeSensors("onPointerLeave", onPointerUp),
                      subscribeSensors("onPointerCancel", onPointerUp)
                  )
                : () => {},
        [offset, subscribe, subscribeSensors, onKeyDown, onPointerDown, onPointerMove, onPointerUp, onWheel, changeZoom]
    );

    const {
        state: { zoom, offsetX, offsetY },
    } = refs.current;

    const scaledRect =
        offset === 0
            ? {
                  width: rect.width * zoom,
                  height: rect.height * zoom,
              }
            : rect;

    let rendered = render.slide?.(slide, offset, scaledRect);

    if (!rendered && isImageSlide(slide)) {
        rendered = (
            <ImageSlide slide={slide} offset={offset} rect={scaledRect} render={render} imageFit={carousel.imageFit} />
        );
    }

    return rendered ? (
        <div
            ref={setContainerRef}
            className={clsx(cssClass("fullsize"), cssClass("flex_center"))}
            {...(offset === 0
                ? { style: { transform: `scale(${zoom}) translate3d(${offsetX}px, ${offsetY}px, 0)` } }
                : null)}
        >
            {rendered}
        </div>
    ) : null;
};
