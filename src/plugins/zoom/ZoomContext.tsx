import * as React from "react";

import { Component } from "../../types.js";
import { isImageSlide, makeUseContext, useEventCallback, useLayoutEffect, useLightboxState } from "../../core/index.js";

type ZoomContextType = {
    isMinZoom: boolean;
    isMaxZoom: boolean;
    isZoomSupported: boolean;
    setIsMinZoom: (value: boolean) => void;
    setIsMaxZoom: (value: boolean) => void;
};

const ZoomContext = React.createContext<ZoomContextType | null>(null);

export const useZoom = makeUseContext("useZoom", "ZoomContext", ZoomContext);

export const ZoomContextProvider: Component = ({ slides, children }) => {
    const [isMinZoom, setIsMinZoom] = React.useState(false);
    const [isMaxZoom, setIsMaxZoom] = React.useState(false);
    const [isZoomSupported, setIsZoomSupported] = React.useState(false);

    const { currentIndex } = useLightboxState().state;

    const updateZoomSupported = useEventCallback(() =>
        setIsZoomSupported(slides.length > currentIndex && isImageSlide(slides[currentIndex]))
    );

    useLayoutEffect(updateZoomSupported, [currentIndex, updateZoomSupported]);

    const context = React.useMemo<ZoomContextType>(
        () => ({
            isMinZoom,
            isMaxZoom,
            isZoomSupported,
            setIsMinZoom,
            setIsMaxZoom,
        }),
        [isMinZoom, isMaxZoom, isZoomSupported]
    );

    return <ZoomContext.Provider value={context}>{children}</ZoomContext.Provider>;
};
