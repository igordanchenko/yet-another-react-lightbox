import * as React from "react";

import { isDefined, makeUseContext } from "../utils.js";

export type TimeoutsContextType = {
    setTimeout: (func: () => void, time?: number) => number;
    clearTimeout: (id?: number) => void;
    clearTimeouts: () => void;
};

const TimeoutsContext = React.createContext<TimeoutsContextType | null>(null);

export const useTimeouts = makeUseContext("useTimeouts", "TimeoutsContext", TimeoutsContext);

export const TimeoutsProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const timeouts = React.useRef<number[]>([]);

    const removeTimeout = (id: number) => {
        timeouts.current.splice(0, timeouts.current.length, ...timeouts.current.filter((tid) => tid !== id));
    };

    const setTimeout = (func: () => void, time?: number) => {
        const id = window.setTimeout(() => {
            removeTimeout(id);
            func();
        }, time);
        timeouts.current.push(id);
        return id;
    };

    const clearTimeout = (id?: number) => {
        if (isDefined(id)) {
            removeTimeout(id);
            window.clearTimeout(id);
        }
    };

    const clearTimeouts = () => {
        timeouts.current.forEach((tid) => window.clearTimeout(tid));
        timeouts.current.splice(0, timeouts.current.length);
    };

    React.useEffect(() => () => clearTimeouts(), []);

    const context = React.useRef({
        setTimeout,
        clearTimeout,
        clearTimeouts,
    });

    return <TimeoutsContext.Provider value={context.current}>{children}</TimeoutsContext.Provider>;
};
