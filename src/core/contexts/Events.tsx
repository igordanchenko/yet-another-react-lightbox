import * as React from "react";

import { makeUseContext } from "../utils.js";

export type Topic = string;

export type Callback = (topic: Topic, event?: unknown) => void;

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
    const subscriptions = React.useRef<Events>({} as Events);

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
        subscriptions.current[topic]?.forEach((callback) => callback(topic, event));
    };

    React.useEffect(
        () => () => {
            subscriptions.current = {} as Events;
        },
        []
    );

    const context = React.useRef<EventsContextType>({
        subscribe,
        unsubscribe,
        publish,
    });

    return <EventsContext.Provider value={context.current}>{children}</EventsContext.Provider>;
};
