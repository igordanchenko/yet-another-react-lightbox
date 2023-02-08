import * as React from "react";

import {
    CLASS_FLEX_CENTER,
    CLASS_FULLSIZE,
    cleanup,
    clsx,
    ContainerRect,
    cssClass,
    EVENT_ON_KEY_DOWN,
    EVENT_ON_POINTER_CANCEL,
    EVENT_ON_POINTER_DOWN,
    EVENT_ON_POINTER_LEAVE,
    EVENT_ON_POINTER_MOVE,
    EVENT_ON_POINTER_UP,
    EVENT_ON_WHEEL,
    ImageSlide,
    isImageSlide,
    round,
    useContainerRect,
    useController,
    useEventCallback,
    useEvents,
    useLayoutEffect,
    useLightboxState,
    useMotionPreference,
} from "../../core/index.js";
import { LightboxProps, Slide } from "../../types.js";
import { useZoom } from "./ZoomContext.js";
import { defaultZoomProps } from "./Zoom.js";
import { ACTION_ZOOM_IN, ACTION_ZOOM_OUT } from "./index.js";
import { isResponsiveImageSlide, ResponsiveImage } from "./ResponsiveImage.js";

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

/** Zoom container */
export const ZoomContainer: React.FC<
    Pick<LightboxProps, "render" | "carousel" | "zoom" | "animation" | "on"> & {
        slide: Slide;
        offset: number;
        rect: ContainerRect;
    }
> = ({ slide, offset, rect, render, carousel, animation, zoom: originalZoomProps, on }) => {
    const zoomProps = { ...defaultZoomProps, ...originalZoomProps };

    const {
        state: { currentIndex },
    } = useLightboxState();

    const [zoom, setZoom] = React.useState(1);
    const [offsetX, setOffsetX] = React.useState(0);
    const [offsetY, setOffsetY] = React.useState(0);
    const [imageDimensions, setImageDimensions] = React.useState<ContainerRect>();

    const activePointers = React.useRef<React.PointerEvent[]>([]);
    const lastPointerDown = React.useRef(0);
    const zoomAnimation = React.useRef<Animation>();
    const zoomAnimationStart = React.useRef<CSSStyleDeclaration["transform"]>();
    const pinchZoomDistance = React.useRef<number>();

    const { isMinZoom, isMaxZoom, setIsMinZoom, setIsMaxZoom } = useZoom();
    const { setContainerRef, containerRef, containerRect } = useContainerRect();
    const { subscribeSensors, containerRef: controllerRef, containerRect: controllerRect } = useController();
    const { subscribe } = useEvents();
    const reduceMotion = useMotionPreference();

    const { slideRect, maxSlideRect: currentMaxSlideRect } = getSlideRects(
        { ...slide, ...imageDimensions },
        carousel.imageFit === "cover" || ("imageFit" in slide && slide.imageFit === "cover"),
        zoomProps.maxZoomPixelRatio,
        containerRect
    );

    const maxZoom = slideRect.width ? Math.max(round(currentMaxSlideRect.width / slideRect.width, 5), 1) : 1;

    const changeOffsets = useEventCallback((dx?: number, dy?: number, targetZoom?: number) => {
        const newZoom = targetZoom || zoom;

        const newOffsetX = offsetX - (dx || 0);
        const newOffsetY = offsetY - (dy || 0);

        const maxOffsetX = containerRect ? (slideRect.width * newZoom - containerRect.width) / 2 / newZoom : 0;
        const maxOffsetY = containerRect ? (slideRect.height * newZoom - containerRect.height) / 2 / newZoom : 0;

        setOffsetX(Math.min(Math.abs(newOffsetX), Math.max(maxOffsetX, 0)) * Math.sign(newOffsetX));
        setOffsetY(Math.min(Math.abs(newOffsetY), Math.max(maxOffsetY, 0)) * Math.sign(newOffsetY));
    });

    const changeZoom = useEventCallback((value: number, rapid?: boolean, dx?: number, dy?: number) => {
        if (!containerRef.current || !containerRect) return;

        const newZoom = round(Math.min(Math.max(value + 0.001 < maxZoom ? value : maxZoom, 1), maxZoom), 5);

        if (newZoom === zoom) return;

        if (!rapid) {
            zoomAnimationStart.current = window.getComputedStyle(containerRef.current).transform;
        }

        changeOffsets(dx ? dx * (1 / zoom - 1 / newZoom) : 0, dy ? dy * (1 / zoom - 1 / newZoom) : 0, newZoom);

        setZoom(newZoom);
    });

    const handleControllerRectChange = useEventCallback(() => {
        if (zoom > 1) {
            if (zoom > maxZoom) {
                changeZoom(maxZoom, true);
            }

            changeOffsets();
        }
    });

    useLayoutEffect(handleControllerRectChange, [
        controllerRect.width,
        controllerRect.height,
        handleControllerRectChange,
    ]);

    const handleZoomAndOffsetChange = useEventCallback(() => {
        zoomAnimation.current?.cancel();

        if (zoomAnimationStart.current && containerRef.current) {
            zoomAnimation.current = containerRef.current.animate?.(
                [
                    { transform: zoomAnimationStart.current },
                    {
                        transform: `scale(${zoom}) translateX(${offsetX}px) translateY(${offsetY}px)`,
                    },
                ],
                {
                    duration: reduceMotion ? 0 : animation.zoom ?? 500,
                    easing: zoomAnimation ? "ease-out" : "ease-in-out",
                }
            );

            zoomAnimationStart.current = undefined;

            if (zoomAnimation.current) {
                zoomAnimation.current.onfinish = () => {
                    zoomAnimation.current = undefined;
                };
            }
        }
    });

    useLayoutEffect(handleZoomAndOffsetChange, [zoom, offsetX, offsetY, handleZoomAndOffsetChange]);

    useLayoutEffect(() => {
        if (offset === 0) {
            const resetZoom = () => {
                setZoom(1);
                setOffsetX(0);
                setOffsetY(0);

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
            const newMinZoom = zoom <= 1;
            if (newMinZoom !== isMinZoom) {
                setIsMinZoom(newMinZoom);
            }

            const newMaxZoom = zoom >= maxZoom;
            if (newMaxZoom !== isMaxZoom) {
                setIsMaxZoom(newMaxZoom);
            }
        }
    }, [offset, zoom, maxZoom, isMinZoom, isMaxZoom, setIsMinZoom, setIsMaxZoom]);

    const onZoomCallback = useEventCallback(() => {
        if (offset === 0) {
            on.zoom?.(zoom);
        }
    });

    useLayoutEffect(onZoomCallback, [zoom, onZoomCallback]);

    const translateCoordinates = React.useCallback(
        (event: React.MouseEvent) => {
            if (controllerRef.current) {
                const { pageX, pageY } = event;
                const { scrollX, scrollY } = window;
                const { left, top, width, height } = controllerRef.current.getBoundingClientRect();
                return [pageX - left - scrollX - width / 2, pageY - top - scrollY - height / 2];
            }
            return [];
        },
        [controllerRef]
    );

    const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
        const { keyboardMoveDistance, zoomInMultiplier } = zoomProps;

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

        const hasMeta = () => event.getModifierState("Meta");

        if (event.key === "+" || (event.key === "=" && hasMeta())) {
            handleChangeZoom(zoom * zoomInMultiplier);
        } else if (event.key === "-" || (event.key === "_" && hasMeta())) {
            handleChangeZoom(zoom / zoomInMultiplier);
        } else if (event.key === "0" && hasMeta()) {
            handleChangeZoom(1);
        }
    });

    const onWheel = useEventCallback((event: React.WheelEvent) => {
        const { wheelZoomDistanceFactor, scrollToZoom } = zoomProps;

        if (event.ctrlKey || scrollToZoom) {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                event.stopPropagation();

                changeZoom(zoom * (1 - event.deltaY / wheelZoomDistanceFactor), true, ...translateCoordinates(event));

                return;
            }
        }

        if (zoom > 1) {
            event.stopPropagation();

            if (!scrollToZoom) {
                changeOffsets(event.deltaX, event.deltaY);
            }
        }
    });

    const clearPointer = React.useCallback((event: React.PointerEvent) => {
        const pointers = activePointers.current;
        pointers.splice(0, pointers.length, ...pointers.filter((p) => p.pointerId !== event.pointerId));
    }, []);

    const replacePointer = React.useCallback(
        (event: React.PointerEvent) => {
            clearPointer(event);
            event.persist();
            activePointers.current.push(event);
        },
        [clearPointer]
    );

    const onPointerDown = useEventCallback((event: React.PointerEvent) => {
        const { doubleTapDelay, doubleClickDelay, zoomInMultiplier, doubleClickMaxStops } = zoomProps;
        const pointers = activePointers.current;

        if (!containerRef.current?.contains(event.target as unknown as Element)) {
            return;
        }

        if (zoom > 1) {
            event.stopPropagation();
        }

        const { timeStamp } = event;
        if (
            pointers.length === 0 &&
            timeStamp - lastPointerDown.current < (event.pointerType === "touch" ? doubleTapDelay : doubleClickDelay)
        ) {
            lastPointerDown.current = 0;
            changeZoom(
                zoom !== maxZoom ? zoom * Math.max(maxZoom ** (1 / doubleClickMaxStops), zoomInMultiplier) : 1,
                false,
                ...translateCoordinates(event)
            );
        } else {
            lastPointerDown.current = timeStamp;
        }

        replacePointer(event);

        if (pointers.length === 2) {
            pinchZoomDistance.current = distance(pointers[0], pointers[1]);
        }
    });

    const onPointerMove = useEventCallback((event: React.PointerEvent) => {
        const pointers = activePointers.current;

        const activePointer = pointers.find((p) => p.pointerId === event.pointerId);

        if (pointers.length === 2 && pinchZoomDistance.current) {
            event.stopPropagation();

            replacePointer(event);

            const currentDistance = distance(pointers[0], pointers[1]);
            const delta = currentDistance - pinchZoomDistance.current;

            if (Math.abs(delta) > 0) {
                changeZoom(
                    zoom * (1 + delta / zoomProps.pinchZoomDistanceFactor),
                    true,
                    ...pointers
                        .map((x) => translateCoordinates(x))
                        .reduce((acc, coordinate) => coordinate.map((x, i) => acc[i] + x / 2))
                );

                pinchZoomDistance.current = currentDistance;
            }

            return;
        }

        if (zoom > 1) {
            event.stopPropagation();

            if (activePointer) {
                if (pointers.length === 1) {
                    changeOffsets(
                        (activePointer.clientX - event.clientX) / zoom,
                        (activePointer.clientY - event.clientY) / zoom
                    );
                }

                replacePointer(event);
            }
        }
    });

    const onPointerUp = React.useCallback(
        (event: React.PointerEvent) => {
            const pointers = activePointers.current;

            if (pointers.length === 2 && pointers.find((p) => p.pointerId === event.pointerId)) {
                pinchZoomDistance.current = undefined;
            }

            clearPointer(event);
        },
        [clearPointer]
    );

    const handleZoomIn = useEventCallback(() => {
        changeZoom(zoom * zoomProps.zoomInMultiplier);
    });

    const handleZoomOut = useEventCallback(() => {
        changeZoom(zoom / zoomProps.zoomInMultiplier);
    });

    React.useEffect(
        () =>
            offset === 0
                ? cleanup(
                      subscribe(ACTION_ZOOM_IN, handleZoomIn),
                      subscribe(ACTION_ZOOM_OUT, handleZoomOut),
                      subscribeSensors(EVENT_ON_KEY_DOWN, onKeyDown),
                      subscribeSensors(EVENT_ON_WHEEL, onWheel),
                      subscribeSensors(EVENT_ON_POINTER_DOWN, onPointerDown),
                      subscribeSensors(EVENT_ON_POINTER_MOVE, onPointerMove),
                      subscribeSensors(EVENT_ON_POINTER_UP, onPointerUp),
                      subscribeSensors(EVENT_ON_POINTER_LEAVE, onPointerUp),
                      subscribeSensors(EVENT_ON_POINTER_CANCEL, onPointerUp)
                  )
                : () => {},
        [
            offset,
            subscribe,
            subscribeSensors,
            onKeyDown,
            onPointerDown,
            onPointerMove,
            onPointerUp,
            onWheel,
            changeZoom,
            handleZoomIn,
            handleZoomOut,
        ]
    );

    const scaledRect =
        offset === 0
            ? {
                  width: rect.width * zoom,
                  height: rect.height * zoom,
              }
            : rect;

    let rendered = render.slide?.(slide, offset, scaledRect);

    if (!rendered && isImageSlide(slide)) {
        const slideProps = {
            slide,
            offset,
            rect,
            render,
            imageFit: carousel.imageFit,
            onClick: offset === 0 ? () => on.click?.(currentIndex) : undefined,
        };

        rendered = isResponsiveImageSlide(slide) ? (
            <ResponsiveImage {...slideProps} slide={slide} rect={scaledRect} />
        ) : (
            <ImageSlide
                onLoad={(img) => setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })}
                {...slideProps}
            />
        );
    }

    return rendered ? (
        <div
            ref={setContainerRef}
            className={clsx(cssClass(CLASS_FULLSIZE), cssClass(CLASS_FLEX_CENTER))}
            {...(offset === 0
                ? { style: { transform: `scale(${zoom}) translateX(${offsetX}px) translateY(${offsetY}px)` } }
                : null)}
        >
            {rendered}
        </div>
    ) : null;
};
