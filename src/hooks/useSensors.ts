import * as React from "react";

import {
    EVENT_ON_KEY_DOWN,
    EVENT_ON_KEY_UP,
    EVENT_ON_POINTER_CANCEL,
    EVENT_ON_POINTER_DOWN,
    EVENT_ON_POINTER_LEAVE,
    EVENT_ON_POINTER_MOVE,
    EVENT_ON_POINTER_UP,
    EVENT_ON_WHEEL,
} from "../consts.js";

export type PointerEventType = "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerLeave" | "onPointerCancel";
export type KeyboardEventType = "onKeyDown" | "onKeyUp";
export type WheelEventType = "onWheel";
export type SupportedEventType = PointerEventType | KeyboardEventType | WheelEventType;

export type ReactEventType<T, K> = K extends KeyboardEventType
    ? React.KeyboardEvent<T>
    : K extends WheelEventType
    ? React.WheelEvent<T>
    : K extends PointerEventType
    ? React.PointerEvent<T>
    : never;

export type SensorCallback<T, P extends React.PointerEvent<T> | React.KeyboardEvent<T> | React.WheelEvent<T>> = (
    event: P
) => void;

export type SubscribeSensors<T> = <ET extends SupportedEventType>(
    type: ET,
    callback: SensorCallback<T, ReactEventType<T, ET>>
) => () => void;

export type RegisterSensors<T> = Required<Pick<React.HTMLAttributes<T>, PointerEventType>> &
    Required<Pick<React.HTMLAttributes<T>, KeyboardEventType>> &
    Required<Pick<React.HTMLAttributes<T>, WheelEventType>>;

export type UseSensors<T> = {
    registerSensors: RegisterSensors<T>;
    subscribeSensors: SubscribeSensors<T>;
};

export function useSensors<T extends Element>(): UseSensors<T> {
    const [subscribers] = React.useState<{
        [K in SupportedEventType]?: SensorCallback<T, ReactEventType<T, K>>[];
    }>({});

    return React.useMemo(() => {
        const notifySubscribers = <ET extends SupportedEventType>(type: ET, event: ReactEventType<T, ET>) => {
            (subscribers[type] as SensorCallback<T, ReactEventType<T, ET>>[])?.forEach((listener) => {
                if (!event.isPropagationStopped()) listener(event);
            });
        };

        return {
            registerSensors: {
                onPointerDown: (event: React.PointerEvent<T>) => notifySubscribers(EVENT_ON_POINTER_DOWN, event),
                onPointerMove: (event: React.PointerEvent<T>) => notifySubscribers(EVENT_ON_POINTER_MOVE, event),
                onPointerUp: (event: React.PointerEvent<T>) => notifySubscribers(EVENT_ON_POINTER_UP, event),
                onPointerLeave: (event: React.PointerEvent<T>) => notifySubscribers(EVENT_ON_POINTER_LEAVE, event),
                onPointerCancel: (event: React.PointerEvent<T>) => notifySubscribers(EVENT_ON_POINTER_CANCEL, event),
                onKeyDown: (event: React.KeyboardEvent<T>) => notifySubscribers(EVENT_ON_KEY_DOWN, event),
                onKeyUp: (event: React.KeyboardEvent<T>) => notifySubscribers(EVENT_ON_KEY_UP, event),
                onWheel: (event: React.WheelEvent<T>) => notifySubscribers(EVENT_ON_WHEEL, event),
            },
            subscribeSensors: <ET extends SupportedEventType>(
                type: ET,
                callback: SensorCallback<T, ReactEventType<T, ET>>
            ) => {
                if (!subscribers[type]) {
                    subscribers[type] = [];
                }
                (subscribers[type] as SensorCallback<T, ReactEventType<T, ET>>[]).unshift(callback);

                return () => {
                    const listeners = subscribers[type] as SensorCallback<T, ReactEventType<T, ET>>[];
                    if (listeners) {
                        listeners.splice(0, listeners.length, ...listeners.filter((el) => el !== callback));
                    }
                };
            },
        };
    }, [subscribers]);
}
