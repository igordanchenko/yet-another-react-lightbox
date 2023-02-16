import * as React from "react";

import { useDelay } from "./useDelay.js";
import { useEventCallback } from "./useEventCallback.js";

export const useThrottle = (callback: (...args: any[]) => void, delay: number) => {
    const lastCallbackTime = React.useRef(0);
    const delayCallback = useDelay();

    const executeCallback = useEventCallback((...args: any[]) => {
        lastCallbackTime.current = Date.now();
        callback(args);
    });

    return React.useCallback(
        (...args: any[]) => {
            delayCallback(() => {
                executeCallback(args);
            }, delay - (Date.now() - lastCallbackTime.current));
        },
        [delay, executeCallback, delayCallback]
    );
};
