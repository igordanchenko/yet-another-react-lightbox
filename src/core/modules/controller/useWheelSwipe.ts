import * as React from "react";

import { useEventCallback, UseSensors } from "../../hooks/index.js";
import { useTimeouts } from "../../contexts/index.js";
import { SwipeState } from "./index.js";
import { useOffset } from "./useOffset.js";
import { EVENT_ON_WHEEL } from "../../consts.js";

export const useWheelSwipe = <T extends Element = Element>(
    swipeState: SwipeState | undefined,
    subscribeSensors: UseSensors<T>["subscribeSensors"],
    isSwipeValid: (offset: number) => boolean,
    containerWidth: number,
    swipeAnimationDuration: number,
    onSwipeStart: () => void,
    onSwipeFinish: (offset: number, duration: number) => void,
    onSwipeCancel: (offset: number) => void,
    onChange: (offset: number) => void
) => {
    const [offset, setOffset] = useOffset(onChange);

    const swipeIntent = React.useRef(0);
    const swipeIntentCleanup = React.useRef<number>();
    const swipeResetCleanup = React.useRef<number>();
    const wheelResidualMomentum = React.useRef(0);
    const startTime = React.useRef(0);

    const { setTimeout, clearTimeout } = useTimeouts();

    const cancelSwipeIntentCleanup = React.useCallback(() => {
        if (swipeIntentCleanup.current) {
            clearTimeout(swipeIntentCleanup.current);
            swipeIntentCleanup.current = undefined;
        }
    }, [clearTimeout]);

    const cancelSwipeResetCleanup = React.useCallback(() => {
        if (swipeResetCleanup.current) {
            clearTimeout(swipeResetCleanup.current);
            swipeResetCleanup.current = undefined;
        }
    }, [clearTimeout]);

    const handleCleanup = useEventCallback(() => {
        if (swipeState !== SwipeState.SWIPE) {
            if (offset !== 0) {
                setOffset(0);
            }

            startTime.current = 0;

            cancelSwipeIntentCleanup();
            cancelSwipeResetCleanup();
        }
    });

    React.useEffect(handleCleanup, [swipeState, handleCleanup]);

    const handleCancelSwipe = useEventCallback((currentSwipeOffset: number) => {
        swipeResetCleanup.current = undefined;

        if (swipeState === SwipeState.SWIPE && offset === currentSwipeOffset) {
            onSwipeCancel(offset);
        }
    });

    const onWheel = useEventCallback((event: React.WheelEvent) => {
        if (event.ctrlKey) {
            // zoom
            return;
        }

        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            // pan-y
            return;
        }

        if (!swipeState) {
            if (Math.abs(event.deltaX) <= 1.2 * Math.abs(wheelResidualMomentum.current)) {
                wheelResidualMomentum.current = event.deltaX;
                return;
            }

            if (!isSwipeValid(-event.deltaX)) {
                return;
            }

            swipeIntent.current += event.deltaX;

            cancelSwipeIntentCleanup();

            if (Math.abs(swipeIntent.current) > 30) {
                swipeIntent.current = 0;
                wheelResidualMomentum.current = 0;
                startTime.current = Date.now();

                onSwipeStart();
            } else {
                const currentSwipeIntent = swipeIntent.current;
                swipeIntentCleanup.current = setTimeout(() => {
                    swipeIntentCleanup.current = undefined;
                    if (currentSwipeIntent === swipeIntent.current) {
                        swipeIntent.current = 0;
                    }
                }, swipeAnimationDuration);
            }
        } else if (swipeState === SwipeState.SWIPE) {
            let newSwipeOffset = offset - event.deltaX;
            newSwipeOffset = Math.min(Math.abs(newSwipeOffset), containerWidth) * Math.sign(newSwipeOffset);
            setOffset(newSwipeOffset);

            cancelSwipeResetCleanup();

            if (Math.abs(newSwipeOffset) > 0.2 * containerWidth) {
                wheelResidualMomentum.current = event.deltaX;

                onSwipeFinish(newSwipeOffset, Date.now() - startTime.current);

                return;
            }

            swipeResetCleanup.current = setTimeout(() => handleCancelSwipe(newSwipeOffset), 2 * swipeAnimationDuration);
        } else {
            wheelResidualMomentum.current = event.deltaX;
        }
    });

    React.useEffect(() => subscribeSensors(EVENT_ON_WHEEL, onWheel), [subscribeSensors, onWheel]);
};
