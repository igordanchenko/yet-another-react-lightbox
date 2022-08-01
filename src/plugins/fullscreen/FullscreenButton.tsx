import * as React from "react";

import { createIcon, IconButton, label, useEventCallback } from "../../core/index.js";
import { LightboxProps } from "../../types.js";
import { useFullscreen } from "./FullscreenContext.js";

const EnterFullscreenIcon = createIcon(
    "EnterFullscreen",
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
);

const ExitFullscreenIcon = createIcon(
    "ExitFullscreen",
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
);

/** Fullscreen button props */
export type FullscreenButtonProps = Pick<LightboxProps, "labels" | "render"> & {
    auto: boolean;
};

/** Fullscreen button */
export const FullscreenButton: React.FC<FullscreenButtonProps> = ({ auto, labels, render }) => {
    const [mounted, setMounted] = React.useState(false);
    const [fullscreen, setFullscreen] = React.useState(false);

    const containerRef = useFullscreen();

    const isFullscreenEnabled = () =>
        document.fullscreenEnabled ??
        document.webkitFullscreenEnabled ??
        document.mozFullScreenEnabled ??
        document.msFullscreenEnabled ??
        false;

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
    }, [containerRef]);

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
    }, [containerRef, getFullscreenElement]);

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

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

    if (!mounted || !isFullscreenEnabled()) return null;

    return render.buttonFullscreen ? (
        <>{render.buttonFullscreen({ fullscreen, toggleFullscreen })}</>
    ) : (
        <IconButton
            label={fullscreen ? label(labels, "Exit Fullscreen") : label(labels, "Enter Fullscreen")}
            icon={fullscreen ? ExitFullscreenIcon : EnterFullscreenIcon}
            renderIcon={fullscreen ? render.iconExitFullscreen : render.iconEnterFullscreen}
            onClick={toggleFullscreen}
        />
    );
};
