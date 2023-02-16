import * as React from "react";

import { createIcon, IconButton, label, useController, useLoseFocus } from "../../core/index.js";
import { useSlideshow } from "./SlideshowContext.js";

const PlayIcon = createIcon("Play", <path d="M8 5v14l11-7z" />);

const PauseIcon = createIcon("Pause", <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />);

export const SlideshowButton: React.FC = () => {
    const { playing, disabled, togglePlaying } = useSlideshow();
    const { getLightboxProps } = useController();
    const { render, labels } = getLightboxProps();
    const focusListeners = useLoseFocus(disabled);

    return render.buttonSlideshow ? (
        <>{render.buttonSlideshow({ playing, togglePlaying, disabled })}</>
    ) : (
        <IconButton
            label={playing ? label(labels, "Pause") : label(labels, "Play")}
            icon={playing ? PauseIcon : PlayIcon}
            renderIcon={playing ? render.iconSlideshowPause : render.iconSlideshowPlay}
            onClick={togglePlaying}
            disabled={disabled}
            {...focusListeners}
        />
    );
};
