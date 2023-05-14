import * as React from "react";

import { createIcon, IconButton, isImageSlide, useLightboxProps, useLightboxState } from "../../index.js";
import { resolveDownloadProps } from "./props.js";
import { saveAs } from "./FileSaver.js";

const DownloadIcon = createIcon(
    "DownloadIcon",
    <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zm-1-4-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5 5-5z" />
);

export function DownloadButton() {
    const { render, on, download: downloadProps } = useLightboxProps();
    const { download: customDownload } = resolveDownloadProps(downloadProps);
    const { currentSlide, currentIndex } = useLightboxState();

    if (render.buttonDownload) {
        return <>{render.buttonDownload()}</>;
    }

    const downloadUrl =
        (currentSlide &&
            (currentSlide.downloadUrl ||
                (typeof currentSlide.download === "string" && currentSlide.download) ||
                (typeof currentSlide.download === "object" && currentSlide.download.url) ||
                (isImageSlide(currentSlide) && currentSlide.src))) ||
        undefined;

    // slides must be explicitly marked as downloadable when custom download function is provided
    const canDownload = customDownload ? Boolean(currentSlide?.download) : Boolean(downloadUrl);

    const defaultDownload = () => {
        if (currentSlide && downloadUrl) {
            const downloadFilename =
                currentSlide.downloadFilename ||
                (typeof currentSlide.download === "object" && currentSlide.download.filename) ||
                undefined;

            saveAs(downloadUrl, downloadFilename);
        }
    };

    const handleDownload = () => {
        if (currentSlide) {
            // noinspection JSUnusedGlobalSymbols
            (customDownload || defaultDownload)({ slide: currentSlide, saveAs });

            on.download?.({ index: currentIndex });
        }
    };

    return (
        <IconButton
            label="Download"
            icon={DownloadIcon}
            renderIcon={render.iconDownload}
            disabled={!canDownload}
            onClick={handleDownload}
        />
    );
}
