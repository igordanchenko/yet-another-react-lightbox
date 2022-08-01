import * as React from "react";

import { isDefined, makeUseContext } from "../utils.js";

export type TimeoutsContextType = {
    setTimeout: (func: () => void, time?: number) => number;
    clearTimeout: (id?: number) => void;
};

const TimeoutsContext = React.createContext<TimeoutsContextType | null>(null);

export const useTimeouts = makeUseContext("useTimeouts", "TimeoutsContext", TimeoutsContext);

export const TimeoutsProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const timeouts = React.useRef<number[]>([]);

    React.useEffect(() => {
        timeouts.current.forEach((tid) => window.clearTimeout(tid));
        timeouts.current.splice(0, timeouts.current.length);
    }, []);

    const context = React.useMemo(() => {
        const removeTimeout = (id: number) => {
            timeouts.current.splice(0, timeouts.current.length, ...timeouts.current.filter((tid) => tid !== id));
        };

        const setTimeout = (fn: () => void, delay?: number) => {
            const id = window.setTimeout(() => {
                removeTimeout(id);
                fn();
            }, delay);
            timeouts.current.push(id);
            return id;
        };

        const clearTimeout = (id?: number) => {
            if (isDefined(id)) {
                removeTimeout(id);
                window.clearTimeout(id);
            }
        };

        return { setTimeout, clearTimeout };
    }, []);

    return <TimeoutsContext.Provider value={context}>{children}</TimeoutsContext.Provider>;
};
