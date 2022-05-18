import * as React from "react";

export const useEnhancedEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
