import * as React from "react";

import { useEnhancedEffect } from "./useEnhancedEffect.js";

export const useRTL = () => {
    const [isRTL, setIsRTL] = React.useState(false);

    useEnhancedEffect(() => {
        setIsRTL(window.getComputedStyle(window.document.documentElement).direction === "rtl");
    }, []);

    return isRTL;
};
