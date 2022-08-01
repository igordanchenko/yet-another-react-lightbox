import * as React from "react";

import { makeUseContext } from "../utils.js";

export type LightboxState = {
    currentIndex: number;
    globalIndex: number;
    animationDuration: number;
};

type LightboxStateAction = { increment?: number; animationDuration: number };

const LightboxStateContext = React.createContext<{
    state: LightboxState;
    dispatch: React.Dispatch<LightboxStateAction>;
} | null>(null);

export const useLightboxState = makeUseContext("useLightboxState", "LightboxStateContext", LightboxStateContext);

const reducer: (slidesCount: number) => React.Reducer<LightboxState, LightboxStateAction> =
    (slidesCount: number) => (state, action) =>
        action.increment !== undefined || action.animationDuration !== undefined
            ? {
                  currentIndex:
                      (((state.currentIndex + (action.increment || 0)) % slidesCount) + slidesCount) % slidesCount,
                  globalIndex: state.globalIndex + (action.increment || 0),
                  animationDuration: action.animationDuration ?? state.animationDuration,
              }
            : state;

type LightboxStateProviderProps = React.PropsWithChildren<{
    slidesCount: number;
    initialIndex: number;
}>;

export const LightboxStateProvider: React.FC<LightboxStateProviderProps> = ({
    initialIndex,
    slidesCount,
    children,
}) => {
    const [state, dispatch] = React.useReducer(reducer(slidesCount), {
        currentIndex: initialIndex,
        globalIndex: initialIndex,
        animationDuration: 0,
    });

    const context = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

    return <LightboxStateContext.Provider value={context}>{children}</LightboxStateContext.Provider>;
};
