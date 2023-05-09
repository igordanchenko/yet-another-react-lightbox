import * as React from "react";

import {
    CLASS_FULLSIZE,
    clsx,
    ComponentProps,
    cssClass,
    FullscreenRef,
    makeUseContext,
    PLUGIN_FULLSCREEN,
    useEventCallback,
    useLayoutEffect,
} from "../../index.js";
import { resolveFullscreenProps } from "./props.js";

export const FullscreenContext = React.createContext<FullscreenRef | null>(null);

export const useFullscreen = makeUseContext("useFullscreen", "FullscreenContext", FullscreenContext);

export function FullscreenContextProvider({ fullscreen: fullscreenProps, children }: ComponentProps) {
    const { auto, ref } = resolveFullscreenProps(fullscreenProps);

    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [fullscreen, setFullscreen] = React.useState(false);
    const [disabled, setDisabled] = React.useState<boolean>();

    useLayoutEffect(() => {
        setDisabled(
            !(
                document.fullscreenEnabled ??
                document.webkitFullscreenEnabled ??
                document.mozFullScreenEnabled ??
                document.msFullscreenEnabled ??
                false
            )
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

    const enter = React.useCallback(() => {
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

    const exit = React.useCallback(() => {
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

    const handleAutoFullscreen = useEventCallback(() => (auto ? enter : null)?.());

    React.useEffect(() => {
        handleAutoFullscreen();
        return () => exit();
    }, [handleAutoFullscreen, exit]);

    const context = React.useMemo(
        () => ({
            fullscreen,
            disabled,
            enter,
            exit,
        }),
        [fullscreen, disabled, enter, exit]
    );

    React.useImperativeHandle(ref, () => context, [context]);

    return (
        <div ref={containerRef} className={clsx(cssClass(PLUGIN_FULLSCREEN), cssClass(CLASS_FULLSIZE))}>
            <FullscreenContext.Provider value={context}>{children}</FullscreenContext.Provider>
        </div>
    );
}
