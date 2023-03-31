import * as React from "react";

import { createIcon, IconButton, useLightboxProps, useLoseFocus } from "../../core/index.js";
import { useSlideshow } from "./SlideshowContext.js";

const PlayIcon = createIcon("Play", <path d="M8 5v14l11-7z" />);

const PauseIcon = createIcon("Pause", <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />);

export function SlideshowButton() {
    const { playing, disabled, play, pause } = useSlideshow();
    const { render } = useLightboxProps();
    const focusListeners = useLoseFocus(disabled);

    if (render.buttonSlideshow) {
        return <>{render.buttonSlideshow({ playing, disabled, play, pause })}</>;
    }

    return (
        <IconButton
            label={playing ? "Pause" : "Play"}
            icon={playing ? PauseIcon : PlayIcon}
            renderIcon={playing ? render.iconSlideshowPause : render.iconSlideshowPlay}
            onClick={playing ? pause : play}
            disabled={disabled}
            {...focusListeners}
        />
    );
}
