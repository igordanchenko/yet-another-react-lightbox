import * as React from "react";

import { useLayoutEffect } from "./useLayoutEffect.js";

export const useMotionPreference = () => {
    const [reduceMotion, setReduceMotion] = React.useState(false);

    useLayoutEffect(() => {
        const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        setReduceMotion(mediaQuery?.matches);
        const listener = () => setReduceMotion(mediaQuery.matches);
        mediaQuery?.addEventListener("change", listener);
        return () => mediaQuery?.removeEventListener("change", listener);
    }, []);

    return reduceMotion;
};
