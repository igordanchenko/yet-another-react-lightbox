import * as React from "react";

export type PointerEventType = "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerLeave" | "onPointerCancel";
export type TouchEventType = "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel";
export type KeyboardEventType = "onKeyDown" | "onKeyUp";
export type WheelEventType = "onWheel";
export type SupportedEventType = PointerEventType | TouchEventType | KeyboardEventType | WheelEventType;

export type ReactEventType<T, K extends SupportedEventType> = K extends TouchEventType
    ? React.TouchEvent<T>
    : K extends KeyboardEventType
    ? React.KeyboardEvent<T>
    : K extends WheelEventType
    ? React.WheelEvent<T>
    : K extends PointerEventType
    ? React.PointerEvent<T>
    : never;

export type EventCallback<
    T,
    P extends React.PointerEvent<T> | React.TouchEvent<T> | React.KeyboardEvent<T> | React.WheelEvent<T>
> = (event: P) => void;

export type SubscribeSensors<T> = <ET extends SupportedEventType>(
    type: ET,
    callback: EventCallback<T, ReactEventType<T, ET>>
) => () => void;

export type RegisterSensors<T> = Required<Pick<React.HTMLAttributes<T>, PointerEventType>> &
    Required<Pick<React.HTMLAttributes<T>, TouchEventType>> &
    Required<Pick<React.HTMLAttributes<T>, KeyboardEventType>> &
    Required<Pick<React.HTMLAttributes<T>, WheelEventType>>;

export type UseSensors<T> = {
    registerSensors: RegisterSensors<T>;
    subscribeSensors: SubscribeSensors<T>;
};

export const useSensors = <T extends Element>(): UseSensors<T> => {
    const [subscribers] = React.useState<{ [K in SupportedEventType]?: EventCallback<T, ReactEventType<T, K>>[] }>({});

    return React.useMemo(() => {
        const notifySubscribers = <ET extends SupportedEventType>(type: ET, event: ReactEventType<T, ET>) => {
            subscribers[type]?.forEach((listener) => listener(event));
        };

        return {
            registerSensors: {
                onPointerDown: (event: React.PointerEvent<T>) => notifySubscribers("onPointerDown", event),
                onPointerMove: (event: React.PointerEvent<T>) => notifySubscribers("onPointerMove", event),
                onPointerUp: (event: React.PointerEvent<T>) => notifySubscribers("onPointerUp", event),
                onPointerLeave: (event: React.PointerEvent<T>) => notifySubscribers("onPointerLeave", event),
                onPointerCancel: (event: React.PointerEvent<T>) => notifySubscribers("onPointerCancel", event),
                onTouchStart: (event: React.TouchEvent<T>) => notifySubscribers("onTouchStart", event),
                onTouchMove: (event: React.TouchEvent<T>) => notifySubscribers("onTouchMove", event),
                onTouchEnd: (event: React.TouchEvent<T>) => notifySubscribers("onTouchEnd", event),
                onTouchCancel: (event: React.TouchEvent<T>) => notifySubscribers("onTouchCancel", event),
                onKeyDown: (event: React.KeyboardEvent<T>) => notifySubscribers("onKeyDown", event),
                onKeyUp: (event: React.KeyboardEvent<T>) => notifySubscribers("onKeyUp", event),
                onWheel: (event: React.WheelEvent<T>) => notifySubscribers("onWheel", event),
            },
            subscribeSensors: <ET extends SupportedEventType>(
                type: ET,
                callback: EventCallback<T, ReactEventType<T, ET>>
            ) => {
                if (!subscribers[type]) {
                    subscribers[type] = [];
                }
                subscribers[type]?.push(callback);

                return () => {
                    const listeners = subscribers[type];
                    if (listeners) {
                        listeners.splice(0, listeners.length, ...listeners.filter((el) => el !== callback));
                    }
                };
            },
        };
    }, [subscribers]);
};
