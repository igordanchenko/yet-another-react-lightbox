import * as React from "react";

import { cleanup } from "../../utils.js";
import { UseSensors } from "../../hooks/useSensors.js";
import { useEventCallback } from "../../hooks/useEventCallback.js";
import { SwipeState } from "./index.js";
import { useOffset } from "./useOffset.js";
import {
    EVENT_ON_POINTER_CANCEL,
    EVENT_ON_POINTER_DOWN,
    EVENT_ON_POINTER_LEAVE,
    EVENT_ON_POINTER_MOVE,
    EVENT_ON_POINTER_UP,
} from "../../consts.js";

export const usePointerSwipe = <T extends Element = Element>(
    swipeState: SwipeState,
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

    const pointers = React.useRef<React.PointerEvent[]>([]);
    const activePointer = React.useRef<number>();
    const startTime = React.useRef<number>(0);

    const clearPointer = React.useCallback((event: React.PointerEvent) => {
        if (activePointer.current === event.pointerId) {
            activePointer.current = undefined;
        }

        const currentPointers = pointers.current;
        currentPointers.splice(
            0,
            currentPointers.length,
            ...currentPointers.filter((p) => p.pointerId !== event.pointerId)
        );
    }, []);

    const addPointer = React.useCallback(
        (event: React.PointerEvent) => {
            clearPointer(event);

            pointers.current.push(event);
        },
        [clearPointer]
    );

    const onPointerDown = useEventCallback((event: React.PointerEvent) => {
        addPointer(event);
    });

    const onPointerUp = useEventCallback((event: React.PointerEvent) => {
        if (
            swipeState === SwipeState.SWIPE &&
            pointers.current.find((x) => x.pointerId === event.pointerId) &&
            activePointer.current === event.pointerId
        ) {
            const duration = Date.now() - startTime.current;
            if (
                Math.abs(offset) > 0.3 * containerWidth ||
                (Math.abs(offset) > 5 && duration < swipeAnimationDuration)
            ) {
                onSwipeFinish(offset, duration);
            } else {
                onSwipeCancel(offset);
            }

            setOffset(0);
        }

        clearPointer(event);
    });

    const onPointerMove = useEventCallback((event: React.PointerEvent) => {
        const pointer = pointers.current.find((p) => p.pointerId === event.pointerId);
        if (pointer) {
            const deltaX = event.clientX - pointer.clientX;
            const deltaY = event.clientY - pointer.clientY;

            if (!swipeState) {
                if (isSwipeValid(deltaX) && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
                    addPointer(event);
                    activePointer.current = event.pointerId;
                    startTime.current = Date.now();

                    onSwipeStart();
                }
            } else if (activePointer.current === event.pointerId) {
                setOffset(deltaX);
            }
        }
    });

    React.useEffect(
        () =>
            cleanup(
                subscribeSensors(EVENT_ON_POINTER_DOWN, onPointerDown),
                subscribeSensors(EVENT_ON_POINTER_MOVE, onPointerMove),
                subscribeSensors(EVENT_ON_POINTER_UP, onPointerUp),
                subscribeSensors(EVENT_ON_POINTER_LEAVE, onPointerUp),
                subscribeSensors(EVENT_ON_POINTER_CANCEL, onPointerUp)
            ),
        [subscribeSensors, onPointerDown, onPointerMove, onPointerUp]
    );
};
