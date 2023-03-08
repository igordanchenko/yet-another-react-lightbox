import * as React from "react";

import { makeUseContext } from "../utils.js";

export interface EventTypes {}

export type Topic = keyof EventTypes;

export type Event<T extends Topic> = EventTypes[T];

export type Callback<T extends Topic> = (event?: Event<T>) => void;

export type Subscribe = <T extends Topic>(topic: T, callback: Callback<T>) => () => void;

export type Unsubscribe = <T extends Topic>(topic: T, callback: Callback<T>) => void;

export type Publish = <T extends Topic>(topic: T, event?: Event<T>) => void;

export type EventsContextType = {
    subscribe: Subscribe;
    unsubscribe: Unsubscribe;
    publish: Publish;
};

const EventsContext = React.createContext<EventsContextType | null>(null);

export const useEvents = makeUseContext("useEvents", "EventsContext", EventsContext);

export function EventsProvider({ children }: React.PropsWithChildren) {
    const [subscriptions] = React.useState<{ [T in Topic]?: Callback<T>[] }>({});

    React.useEffect(
        () => () => {
            (Object.keys(subscriptions) as Topic[]).forEach((key) => delete subscriptions[key]);
        },
        [subscriptions]
    );

    const context = React.useMemo<EventsContextType>(() => {
        const unsubscribe = <T extends Topic>(topic: T, callback: Callback<T>) => {
            subscriptions[topic]?.splice(
                0,
                subscriptions[topic]!.length,
                ...subscriptions[topic]!.filter((cb) => cb !== callback)
            );
        };

        const subscribe = <T extends Topic>(topic: T, callback: Callback<T>) => {
            if (!subscriptions[topic]) {
                subscriptions[topic] = [];
            }
            subscriptions[topic]!.push(callback);

            return () => unsubscribe(topic, callback);
        };

        const publish = <T extends Topic>(topic: T, event?: Event<T>) => {
            subscriptions[topic]?.forEach((callback) => callback(event));
        };

        return { publish, subscribe, unsubscribe };
    }, [subscriptions]);

    return <EventsContext.Provider value={context}>{children}</EventsContext.Provider>;
}
