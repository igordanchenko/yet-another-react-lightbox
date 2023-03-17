import * as React from "react";

import { useEventCallback, useLayoutEffect, useLightboxProps, useMotionPreference } from "../../../core/index.js";

export function useZoomAnimation(
    zoom: number,
    offsetX: number,
    offsetY: number,
    zoomWrapperRef?: React.RefObject<HTMLDivElement>
) {
    const zoomAnimation = React.useRef<Animation>();
    const zoomAnimationStart = React.useRef<CSSStyleDeclaration["transform"]>();

    const { zoom: zoomAnimationDuration } = useLightboxProps().animation;
    const reduceMotion = useMotionPreference();

    const playZoomAnimation = useEventCallback(() => {
        zoomAnimation.current?.cancel();

        if (zoomAnimationStart.current && zoomWrapperRef?.current) {
            zoomAnimation.current = zoomWrapperRef.current.animate?.(
                [
                    { transform: zoomAnimationStart.current },
                    { transform: `scale(${zoom}) translateX(${offsetX}px) translateY(${offsetY}px)` },
                ],
                {
                    duration: !reduceMotion ? zoomAnimationDuration ?? 500 : 0,
                    easing: zoomAnimation.current ? "ease-out" : "ease-in-out",
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

    useLayoutEffect(playZoomAnimation, [zoom, offsetX, offsetY, playZoomAnimation]);

    return React.useCallback(() => {
        zoomAnimationStart.current = zoomWrapperRef?.current
            ? window.getComputedStyle(zoomWrapperRef.current).transform
            : undefined;
    }, [zoomWrapperRef]);
}
