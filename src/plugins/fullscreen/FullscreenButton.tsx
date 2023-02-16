import * as React from "react";
import { createIcon, IconButton, label, useController } from "../../core/index.js";
import { useFullscreen } from "./FullscreenContext.js";

const EnterFullscreenIcon = createIcon(
    "EnterFullscreen",
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
);

const ExitFullscreenIcon = createIcon(
    "ExitFullscreen",
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
);

/** Fullscreen button */
export const FullscreenButton: React.FC = () => {
    const { labels, render } = useController().getLightboxProps();
    const { fullscreen, fullscreenEnabled, toggleFullscreen } = useFullscreen();

    if (!fullscreenEnabled) return null;

    return render.buttonFullscreen ? (
        <>{render.buttonFullscreen?.({ fullscreen, fullscreenEnabled, toggleFullscreen })}</>
    ) : (
        <IconButton
            disabled={!fullscreenEnabled}
            label={fullscreen ? label(labels, "Exit Fullscreen") : label(labels, "Enter Fullscreen")}
            icon={fullscreen ? ExitFullscreenIcon : EnterFullscreenIcon}
            renderIcon={fullscreen ? render.iconExitFullscreen : render.iconEnterFullscreen}
            onClick={toggleFullscreen}
        />
    );
};
