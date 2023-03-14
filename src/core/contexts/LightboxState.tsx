import * as React from "react";

import { LightboxProps, Slide } from "../../types.js";
import { getSlideIndex, makeUseContext } from "../utils.js";

export type LightboxState = {
    slides: Slide[];
    currentIndex: number;
    globalIndex: number;
    animation?: { increment?: number; duration?: number; easing?: string };
};

export type LightboxStateSwipeAction = {
    type: "swipe";
    increment: number;
    duration?: number;
    easing?: string;
};

export type LightboxStateUpdateAction = {
    type: "update";
    slides: Slide[];
    index: number;
};

export type LightboxStateAction = LightboxStateSwipeAction | LightboxStateUpdateAction;

const LightboxStateContext = React.createContext<{
    state: LightboxState;
    dispatch: React.Dispatch<LightboxStateAction>;
} | null>(null);

export const useLightboxState = makeUseContext("useLightboxState", "LightboxStateContext", LightboxStateContext);

function reducer(state: LightboxState, action: LightboxStateAction): LightboxState {
    switch (action.type) {
        case "swipe": {
            const { slides } = state;
            const increment = action?.increment || 0;
            const globalIndex = state.globalIndex + increment;
            const currentIndex = getSlideIndex(globalIndex, slides.length);
            const animation =
                increment || action.duration
                    ? {
                          increment,
                          duration: action.duration,
                          easing: action.easing,
                      }
                    : undefined;
            return { slides, currentIndex, globalIndex, animation };
        }
        case "update":
            return {
                slides: action.slides,
                currentIndex: action.index,
                globalIndex: action.index,
            };
        default:
            throw new Error("Unknown action type");
    }
}

export type LightboxStateProviderProps = React.PropsWithChildren<Pick<LightboxProps, "slides" | "index">>;

export function LightboxStateProvider({ slides, index, children }: LightboxStateProviderProps) {
    const [state, dispatch] = React.useReducer(reducer, { slides, currentIndex: index, globalIndex: index });

    React.useEffect(() => {
        dispatch({ type: "update", slides, index });
    }, [slides, index]);

    const context = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

    return <LightboxStateContext.Provider value={context}>{children}</LightboxStateContext.Provider>;
}
