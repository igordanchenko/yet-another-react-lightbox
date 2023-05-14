import * as React from "react";

import { createIcon, IconButton, isImageSlide, useLightboxProps, useLightboxState } from "../../index.js";
import { resolveShareProps } from "./props.js";
import { isShareSupported } from "./utils.js";

const ShareIcon = createIcon(
    "ShareIcon",
    <path d="m16 5-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z" />
);

export function ShareButton() {
    const { render, on, share: shareProps } = useLightboxProps();
    const { share: customShare } = resolveShareProps(shareProps);
    const { currentSlide, currentIndex } = useLightboxState();

    if (!isShareSupported()) return null;

    if (render.buttonShare) {
        return <>{render.buttonShare()}</>;
    }

    const share =
        (currentSlide &&
            ((typeof currentSlide.share === "object" && currentSlide.share) ||
                (typeof currentSlide.share === "string" && { url: currentSlide.share }) ||
                (isImageSlide(currentSlide) && { url: currentSlide.src }))) ||
        undefined;

    // slides must be explicitly marked as shareable when custom share function is provided
    const canShare = customShare ? Boolean(currentSlide?.share) : share && navigator.canShare(share);

    const defaultShare = () => {
        if (share) {
            navigator.share(share).catch(() => {});
        }
    };

    const handleShare = () => {
        if (currentSlide) {
            (customShare || defaultShare)({ slide: currentSlide });

            on.share?.({ index: currentIndex });
        }
    };

    return (
        <IconButton
            label="Share"
            icon={ShareIcon}
            renderIcon={render.iconShare}
            disabled={!canShare}
            onClick={handleShare}
        />
    );
}
