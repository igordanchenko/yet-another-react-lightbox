import * as React from "react";

import { CLASS_FULLSIZE, clsx, cssClass, makeUseContext, PLUGIN_FULLSCREEN } from "../../core/index.js";

type FullscreenContextType = React.RefObject<HTMLDivElement>;

const FullscreenContext = React.createContext<FullscreenContextType | null>(null);

export const useFullscreen = makeUseContext("useFullscreen", "FullscreenContext", FullscreenContext);

export const FullscreenContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    return (
        <div ref={containerRef} className={clsx(cssClass(PLUGIN_FULLSCREEN), cssClass(CLASS_FULLSIZE))}>
            <FullscreenContext.Provider value={containerRef}>{children}</FullscreenContext.Provider>
        </div>
    );
};
