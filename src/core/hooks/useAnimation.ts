/* eslint-disable prefer-destructuring */

import * as React from "react";

import { useLayoutEffect } from "./useLayoutEffect.js";
import { useMotionPreference } from "./useMotionPreference.js";

const currentTransformation = (node: HTMLElement) => {
    let x = 0;
    let y = 0;
    let z = 0;
    const matrix = window.getComputedStyle(node).transform;
    const matcher = matrix.match(/matrix.*\((.+)\)/);
    if (matcher) {
        const values = matcher[1].split(",").map((str) => Number.parseInt(str, 10));
        if (values.length === 6) {
            x = values[4];
            y = values[5];
        } else if (values.length === 16) {
            x = values[12];
            y = values[13];
            z = values[14];
        }
    }
    return { x, y, z };
};

export const useAnimation = <T>(
    nodeRef: React.RefObject<HTMLElement | null>,
    computeAnimation: (
        snapshot: T,
        rect: DOMRect,
        translate: { x: number; y: number; z: number }
    ) => { keyframes: Keyframe[]; duration: number; onfinish?: () => void } | undefined
) => {
    const snapshot = React.useRef<T>();
    const animation = React.useRef<Animation>();

    const reduceMotion = useMotionPreference();

    useLayoutEffect(() => {
        if (nodeRef.current && snapshot.current !== undefined && !reduceMotion) {
            const { keyframes, duration, onfinish } =
                computeAnimation(
                    snapshot.current,
                    nodeRef.current.getBoundingClientRect(),
                    currentTransformation(nodeRef.current)
                ) || {};

            if (keyframes && duration) {
                animation.current?.cancel();

                animation.current = nodeRef.current.animate?.(keyframes, duration);

                if (animation.current) {
                    animation.current.onfinish = () => {
                        animation.current = undefined;

                        onfinish?.();
                    };
                }
            }
        }

        snapshot.current = undefined;
    });

    return (currentSnapshot: T | undefined) => {
        snapshot.current = currentSnapshot;
    };
};
