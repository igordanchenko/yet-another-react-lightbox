import * as React from "react";

import { ContainerRect, ImageFit, LightboxProps, Render, Slide } from "../../types.js";
import {
    CLASS_FLEX_CENTER,
    CLASS_FULLSIZE,
    clsx,
    createIcon,
    cssClass,
    cssVar,
    ELEMENT_ICON,
    ImageSlide,
    isImageSlide,
    makeComposePrefix,
} from "../../core/index.js";
import { cssPrefix, cssThumbnailPrefix } from "./utils.js";

const VideoThumbnailIcon = createIcon(
    "VideoThumbnail",
    <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
);

const UnknownThumbnailIcon = createIcon(
    "UnknownThumbnail",
    <path d="M23 18V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zM8.5 12.5l2.5 3.01L14.5 11l4.5 6H5l3.5-4.5z" />
);

const renderThumbnail: Render["thumbnail"] = ({ slide, render, rect, imageFit }) => {
    const customThumbnail = render.thumbnail?.({ slide, render, rect, imageFit });
    if (customThumbnail) {
        return customThumbnail;
    }

    const thumbnailIconClass = cssClass(cssThumbnailPrefix(ELEMENT_ICON));

    if (!isImageSlide(slide)) {
        if (slide.type === "video") {
            return (
                <>
                    {"poster" in slide && (
                        <img
                            alt=""
                            src={slide.poster}
                            className={clsx(cssClass(CLASS_FULLSIZE), cssClass(cssPrefix("contain_image")))}
                        />
                    )}
                    <VideoThumbnailIcon className={thumbnailIconClass} />
                </>
            );
        }
    } else {
        return <ImageSlide slide={slide} render={render} rect={rect} imageFit={imageFit} />;
    }

    return <UnknownThumbnailIcon className={thumbnailIconClass} />;
};

type FadeSettings = {
    duration: number;
    delay: number;
};

type ThumbnailProps = {
    rect: ContainerRect;
    slide: Slide | null;
    onClick: () => void;
    active: boolean;
    fadeIn?: FadeSettings;
    fadeOut?: FadeSettings;
    placeholder: boolean;
    render: LightboxProps["render"];
    imageFit: ImageFit;
    style?: React.CSSProperties;
};

const activePrefix = makeComposePrefix("active");
const fadeInPrefix = makeComposePrefix("fadein");
const fadeOutPrefix = makeComposePrefix("fadeout");
const placeholderPrefix = makeComposePrefix("placeholder");

const DELAY = "delay";
const DURATION = "duration";

export const Thumbnail: React.FC<ThumbnailProps> = ({
    rect,
    slide,
    onClick,
    active,
    fadeIn,
    fadeOut,
    placeholder,
    render,
    imageFit,
    style,
}) => (
    <button
        type="button"
        className={clsx(
            cssClass(CLASS_FLEX_CENTER),
            cssClass(cssThumbnailPrefix()),
            active && cssClass(cssThumbnailPrefix(activePrefix())),
            fadeIn && cssClass(cssThumbnailPrefix(fadeInPrefix())),
            fadeOut && cssClass(cssThumbnailPrefix(fadeOutPrefix())),
            placeholder && cssClass(cssThumbnailPrefix(placeholderPrefix()))
        )}
        style={{
            ...(fadeIn
                ? {
                      [cssVar(cssThumbnailPrefix(fadeInPrefix(DURATION)))]: `${fadeIn.duration}ms`,
                      [cssVar(cssThumbnailPrefix(fadeInPrefix(DELAY)))]: `${fadeIn.delay}ms`,
                  }
                : null),
            ...(fadeOut
                ? {
                      [cssVar(cssThumbnailPrefix(fadeOutPrefix(DURATION)))]: `${fadeOut.duration}ms`,
                      [cssVar(cssThumbnailPrefix(fadeOutPrefix(DELAY)))]: `${fadeOut.delay}ms`,
                  }
                : null),
            ...style,
        }}
        onClick={onClick}
    >
        {slide && renderThumbnail({ slide, render, rect, imageFit })}
    </button>
);
