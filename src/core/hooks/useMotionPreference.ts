import * as React from "react";

export const useMotionPreference = () => {
    const [reduceMotion, setReduceMotion] = React.useState<boolean>();

    React.useEffect(() => {
        const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        mediaQuery?.addEventListener("change", () => setReduceMotion(mediaQuery.matches));
        setReduceMotion(mediaQuery?.matches);
    }, []);

    return React.useMemo(() => ({ reduceMotion }), [reduceMotion]);
};
