import * as React from "react";

import { Component } from "../../types.js";
import {
    CLASS_FULLSIZE,
    clsx,
    cssClass,
    makeUseContext,
    PLUGIN_FULLSCREEN,
    useEventCallback,
    useLayoutEffect,
} from "../../core/index.js";

type FullscreenContextType = {
    fullscreen: boolean;
    fullscreenEnabled?: boolean;
    toggleFullscreen: () => void;
};

const FullscreenContext = React.createContext<FullscreenContextType | null>(null);

export const useFullscreen = makeUseContext("useFullscreen", "FullscreenContext", FullscreenContext);

export const FullscreenContextProvider: Component = ({ fullscreen: auto, children }) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [fullscreen, setFullscreen] = React.useState(false);
    const [fullscreenEnabled, setFullscreenEnabled] = React.useState<boolean>();

    useLayoutEffect(() => {
        setFullscreenEnabled(
            document.fullscreenEnabled ??
                document.webkitFullscreenEnabled ??
                document.mozFullScreenEnabled ??
                document.msFullscreenEnabled ??
                false
        );
    }, []);

    const getFullscreenElement = React.useCallback(
        () =>
            document.fullscreenElement ??
            document.webkitFullscreenElement ??
            document.mozFullScreenElement ??
            document.msFullscreenElement,
        []
    );

    const requestFullscreen = React.useCallback(() => {
        const container = containerRef.current;
        if (container) {
            try {
                if (container.requestFullscreen) {
                    container.requestFullscreen().catch(() => {});
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
            } catch (err) {
                //
            }
        }
    }, []);

    const exitFullscreen = React.useCallback(() => {
        if (getFullscreenElement()) {
            try {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } catch (err) {
                //
            }
        }
    }, [getFullscreenElement]);

    const toggleFullscreen = React.useCallback(() => {
        if (fullscreen) {
            exitFullscreen();
        } else {
            requestFullscreen();
        }
    }, [fullscreen, requestFullscreen, exitFullscreen]);

    const fullscreenChangeListener = React.useCallback(() => {
        if (getFullscreenElement() === containerRef.current) {
            setFullscreen(true);
        } else {
            setFullscreen(false);
        }
    }, [getFullscreenElement]);

    React.useEffect(() => {
        const events = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"];

        events.forEach((event) => {
            document.addEventListener(event, fullscreenChangeListener);
        });

        return () => {
            events.forEach((event) => {
                document.removeEventListener(event, fullscreenChangeListener);
            });
        };
    }, [fullscreenChangeListener]);

    const handleAutoFullscreen = useEventCallback(() => {
        if (auto) {
            requestFullscreen();
        }
    });

    React.useEffect(() => {
        handleAutoFullscreen();

        return () => {
            exitFullscreen();
        };
    }, [handleAutoFullscreen, exitFullscreen]);

    const context = React.useMemo(
        () => ({
            fullscreen,
            fullscreenEnabled,
            toggleFullscreen,
        }),
        [fullscreen, fullscreenEnabled, toggleFullscreen]
    );

    return (
        <div ref={containerRef} className={clsx(cssClass(PLUGIN_FULLSCREEN), cssClass(CLASS_FULLSIZE))}>
            <FullscreenContext.Provider value={context}>{children}</FullscreenContext.Provider>
        </div>
    );
};
