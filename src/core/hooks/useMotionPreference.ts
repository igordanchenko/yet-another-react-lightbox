import * as React from "react";

import { useLayoutEffect } from "./useLayoutEffect.js";

export const useMotionPreference = () => {
    const [reduceMotion, setReduceMotion] = React.useState(false);

    useLayoutEffect(() => {
        const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        mediaQuery?.addEventListener("change", () => setReduceMotion(mediaQuery.matches));
        setReduceMotion(mediaQuery?.matches);
    }, []);

    return reduceMotion;
};
