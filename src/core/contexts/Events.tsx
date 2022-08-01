import * as React from "react";

import { makeUseContext } from "../utils.js";

export type Topic = string;

export type Callback = (event?: unknown) => void;

export type Events = {
    [key: string]: Callback[];
};

export type Subscribe = (topic: Topic, callback: Callback) => () => void;

export type Unsubscribe = (topic: Topic, callback: Callback) => void;

export type Publish = (topic: Topic, event?: unknown) => void;

export type EventsContextType = {
    subscribe: Subscribe;
    unsubscribe: Unsubscribe;
    publish: Publish;
};

const EventsContext = React.createContext<EventsContextType | null>(null);

export const useEvents = makeUseContext("useEvents", "EventsContext", EventsContext);

export const EventsProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const subscriptions = React.useRef<Events>({});

    React.useEffect(
        () => () => {
            subscriptions.current = {};
        },
        []
    );

    const context = React.useMemo<EventsContextType>(() => {
        const unsubscribe = (topic: Topic, callback: Callback) => {
            if (subscriptions.current[topic]) {
                subscriptions.current[topic] = subscriptions.current[topic].filter((cb) => cb !== callback);
            }
        };

        const subscribe = (topic: Topic, callback: Callback) => {
            if (!subscriptions.current[topic]) {
                subscriptions.current[topic] = [];
            }
            subscriptions.current[topic].push(callback);

            return () => unsubscribe(topic, callback);
        };

        const publish = (topic: Topic, event?: unknown) => {
            subscriptions.current[topic]?.forEach((callback) => callback(event));
        };

        return { publish, subscribe, unsubscribe };
    }, []);

    return <EventsContext.Provider value={context}>{children}</EventsContext.Provider>;
};
