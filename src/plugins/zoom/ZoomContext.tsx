import * as React from "react";

import { Component } from "../../types.js";
import { makeUseContext } from "../../core/index.js";

type ZoomContextType = {
    isMinZoom: boolean;
    isMaxZoom: boolean;
    isZoomSupported: boolean;
    setIsMinZoom: (value: boolean) => void;
    setIsMaxZoom: (value: boolean) => void;
    setIsZoomSupported: (value: boolean) => void;
};

const ZoomContext = React.createContext<ZoomContextType | null>(null);

export const useZoom = makeUseContext("useZoom", "ZoomContext", ZoomContext);

export const ZoomContextProvider: Component = ({ children }) => {
    const [isMinZoom, setIsMinZoom] = React.useState(false);
    const [isMaxZoom, setIsMaxZoom] = React.useState(false);
    const [isZoomSupported, setIsZoomSupported] = React.useState(false);

    const context = React.useMemo<ZoomContextType>(
        () => ({
            isMinZoom,
            isMaxZoom,
            isZoomSupported,
            setIsMinZoom,
            setIsMaxZoom,
            setIsZoomSupported,
        }),
        [isMinZoom, isMaxZoom, isZoomSupported]
    );

    return <ZoomContext.Provider value={context}>{children}</ZoomContext.Provider>;
};
