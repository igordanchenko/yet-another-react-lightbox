import * as React from "react";

import { makeUseContext } from "../utils.js";

export type Callback = (event?: unknown) => void;

export type Subscribe = (topic: string, callback: Callback) => () => void;

export type Unsubscribe = (topic: string, callback: Callback) => void;

export type Publish = (topic: string, event?: unknown) => void;

export type EventsContextType = {
    subscribe: Subscribe;
    unsubscribe: Unsubscribe;
    publish: Publish;
};

const EventsContext = React.createContext<EventsContextType | null>(null);

export const useEvents = makeUseContext("useEvents", "EventsContext", EventsContext);

export const EventsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [subscriptions] = React.useState<{ [key: string]: Callback[] }>({});

    React.useEffect(
        () => () => {
            Object.keys(subscriptions).forEach((key) => delete subscriptions[key]);
        },
        [subscriptions]
    );

    const context = React.useMemo<EventsContextType>(() => {
        const unsubscribe = (topic: string, callback: Callback) => {
            if (subscriptions[topic]) {
                subscriptions[topic] = subscriptions[topic].filter((cb) => cb !== callback);
            }
        };

        const subscribe = (topic: string, callback: Callback) => {
            if (!subscriptions[topic]) {
                subscriptions[topic] = [];
            }
            subscriptions[topic].push(callback);

            return () => unsubscribe(topic, callback);
        };

        const publish = (topic: string, event?: unknown) => {
            subscriptions[topic]?.forEach((callback) => callback(event));
        };

        return { publish, subscribe, unsubscribe };
    }, [subscriptions]);

    return <EventsContext.Provider value={context}>{children}</EventsContext.Provider>;
};
