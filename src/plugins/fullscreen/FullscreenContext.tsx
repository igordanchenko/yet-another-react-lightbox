import * as React from "react";

import { clsx, cssClass, makeUseContext } from "../../core/index.js";

type FullscreenContextType = {
    containerRef: React.RefObject<HTMLDivElement>;
};

const FullscreenContext = React.createContext<FullscreenContextType | null>(null);

export const useFullscreen = makeUseContext("useFullscreen", "FullscreenContext", FullscreenContext);

export const FullscreenContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const context = React.useMemo(() => ({ containerRef }), []);

    return (
        <div ref={containerRef} className={clsx(cssClass("fullscreen"), cssClass("fullsize"))}>
            <FullscreenContext.Provider value={context}>{children}</FullscreenContext.Provider>
        </div>
    );
};
