import * as React from "react";

import { createIcon, IconButton, useLightboxProps } from "../../index.js";
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
export function FullscreenButton() {
    const { fullscreen, disabled, enter, exit } = useFullscreen();
    const { render } = useLightboxProps();

    if (disabled) return null;

    if (render.buttonFullscreen) {
        return <>{render.buttonFullscreen?.({ fullscreen, disabled, enter, exit })}</>;
    }

    return (
        <IconButton
            disabled={disabled}
            label={fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            icon={fullscreen ? ExitFullscreenIcon : EnterFullscreenIcon}
            renderIcon={fullscreen ? render.iconExitFullscreen : render.iconEnterFullscreen}
            onClick={fullscreen ? exit : enter}
        />
    );
}
