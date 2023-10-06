import * as React from "react";

import {
    ContainerRect,
    isImageSlide,
    round,
    Slide,
    useController,
    useEventCallback,
    useLayoutEffect,
    useLightboxState,
} from "../../../index.js";
import { useZoomProps } from "./useZoomProps.js";
import { useZoomAnimation } from "./useZoomAnimation.js";

function getCurrentSource(slides: Slide[], currentIndex: number) {
    if (currentIndex < slides.length) {
        const slide = slides[currentIndex];
        if (isImageSlide(slide)) return slide.src;
    }
    return undefined;
}

export function useZoomState(
    imageRect: ContainerRect,
    maxZoom: number,
    zoomWrapperRef?: React.RefObject<HTMLDivElement>
) {
    const [zoom, setZoom] = React.useState(1);
    const [offsetX, setOffsetX] = React.useState(0);
    const [offsetY, setOffsetY] = React.useState(0);

    const animate = useZoomAnimation(zoom, offsetX, offsetY, zoomWrapperRef);

    const { slides, currentIndex, globalIndex } = useLightboxState();

    const { containerRect, slideRect } = useController();

    const { zoomInMultiplier } = useZoomProps();

    const currentSource = getCurrentSource(slides, currentIndex);
    const disabled = !currentSource || !zoomWrapperRef?.current;

    useLayoutEffect(() => {
        setZoom(1);
        setOffsetX(0);
        setOffsetY(0);
    }, [globalIndex, currentSource]);

    const changeOffsets = React.useCallback(
        (dx?: number, dy?: number, targetZoom?: number) => {
            const newZoom = targetZoom || zoom;

            const newOffsetX = offsetX - (dx || 0);
            const newOffsetY = offsetY - (dy || 0);

            const maxOffsetX = (imageRect.width * newZoom - slideRect.width) / 2 / newZoom;
            const maxOffsetY = (imageRect.height * newZoom - slideRect.height) / 2 / newZoom;

            setOffsetX(Math.min(Math.abs(newOffsetX), Math.max(maxOffsetX, 0)) * Math.sign(newOffsetX));
            setOffsetY(Math.min(Math.abs(newOffsetY), Math.max(maxOffsetY, 0)) * Math.sign(newOffsetY));
        },
        [zoom, offsetX, offsetY, slideRect, imageRect.width, imageRect.height]
    );

    const changeZoom = React.useCallback(
        (targetZoom: number, rapid?: boolean, dx?: number, dy?: number) => {
            const newZoom = round(
                Math.min(Math.max(targetZoom + 0.001 < maxZoom ? targetZoom : maxZoom, 1), maxZoom),
                5
            );

            if (newZoom === zoom) return;

            if (!rapid) {
                animate();
            }

            changeOffsets(dx ? dx * (1 / zoom - 1 / newZoom) : 0, dy ? dy * (1 / zoom - 1 / newZoom) : 0, newZoom);

            setZoom(newZoom);
        },
        [zoom, maxZoom, changeOffsets, animate]
    );

    const handleControllerRectChange = useEventCallback(() => {
        if (zoom > 1) {
            if (zoom > maxZoom) {
                changeZoom(maxZoom, true);
            }

            changeOffsets();
        }
    });

    useLayoutEffect(handleControllerRectChange, [
        containerRect.width,
        containerRect.height,
        handleControllerRectChange,
    ]);

    const zoomIn = React.useCallback(() => changeZoom(zoom * zoomInMultiplier), [zoom, zoomInMultiplier, changeZoom]);

    const zoomOut = React.useCallback(() => changeZoom(zoom / zoomInMultiplier), [zoom, zoomInMultiplier, changeZoom]);

    return { zoom, offsetX, offsetY, disabled, changeOffsets, changeZoom, zoomIn, zoomOut };
}
