import * as React from "react";

import { useEnhancedEffect } from "./useEnhancedEffect.js";

export const useMotionPreference = () => {
    const [reduceMotion, setReduceMotion] = React.useState(false);

    useEnhancedEffect(() => {
        const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        mediaQuery?.addEventListener("change", () => setReduceMotion(mediaQuery.matches));
        setReduceMotion(mediaQuery?.matches);
    }, []);

    return reduceMotion;
};
