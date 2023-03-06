import * as React from "react";

import { getSlideIndex, makeUseContext } from "../utils.js";

export type LightboxState = {
    currentIndex: number;
    globalIndex: number;
    // TODO v3: remove
    /** @deprecated use `animation.duration` */
    animationDuration: number;
    animation?: LightboxStateAction;
};

export type LightboxStateAction =
    | {
          increment: number;
          duration?: number;
          easing?: string;
      }
    | undefined;

const LightboxStateContext = React.createContext<{
    state: LightboxState;
    dispatch: React.Dispatch<LightboxStateAction>;
} | null>(null);

export const useLightboxState = makeUseContext("useLightboxState", "LightboxStateContext", LightboxStateContext);

const reducer: (slidesCount: number) => React.Reducer<LightboxState, LightboxStateAction> =
    (slidesCount: number) => (state, action) => {
        const increment = action?.increment || 0;
        const globalIndex = state.globalIndex + increment;
        const currentIndex = getSlideIndex(globalIndex, slidesCount);
        const animationDuration = action?.duration || 0;
        return {
            globalIndex,
            currentIndex,
            animation: action,
            animationDuration,
        };
    };

type LightboxStateProviderProps = React.PropsWithChildren<{
    slidesCount: number;
    initialIndex: number;
}>;

export const LightboxStateProvider: React.FC<LightboxStateProviderProps> = ({
    initialIndex,
    slidesCount,
    children,
}) => {
    const memoizedReducer = React.useMemo(() => reducer(slidesCount), [slidesCount]);
    const [state, dispatch] = React.useReducer(memoizedReducer, {
        currentIndex: initialIndex,
        globalIndex: initialIndex,
        animationDuration: 0,
    });

    const context = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

    return <LightboxStateContext.Provider value={context}>{children}</LightboxStateContext.Provider>;
};
