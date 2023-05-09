import * as React from "react";

import { createIcon, IconButton, isImageSlide, useLightboxProps, useLightboxState } from "../../index.js";
import { saveAs } from "./FileSaver.js";

const DownloadIcon = createIcon(
    "DownloadIcon",
    <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zm-1-4-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5 5-5z" />
);

export function DownloadButton() {
    const { render, on } = useLightboxProps();
    const { currentSlide, currentIndex } = useLightboxState();

    if (render.buttonDownload) {
        return <>{render.buttonDownload()}</>;
    }

    const downloadUrl =
        currentSlide?.downloadUrl || (currentSlide && isImageSlide(currentSlide) ? currentSlide.src : undefined);

    return (
        <IconButton
            label="Download"
            icon={DownloadIcon}
            renderIcon={render.iconDownload}
            disabled={!downloadUrl}
            onClick={() => {
                if (downloadUrl) {
                    saveAs(downloadUrl, currentSlide?.downloadFilename);

                    on.download?.({ index: currentIndex });
                }
            }}
        />
    );
}
