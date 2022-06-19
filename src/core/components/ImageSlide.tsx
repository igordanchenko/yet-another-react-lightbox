import * as React from "react";

import { ImageFit, Render, SlideImage } from "../../types.js";
import { adjustDevicePixelRatio, clsx, cssClass, hasWindow } from "../utils.js";
import { ContainerRect, useLatest } from "../hooks/index.js";
import { useEvents } from "../contexts/index.js";
import { ErrorIcon, LoadingIcon } from "./Icons.js";
import {
    activeSlideStatus,
    SLIDE_STATUS_COMPLETE,
    SLIDE_STATUS_ERROR,
    SLIDE_STATUS_LOADING,
    SlideStatus,
} from "../consts.js";

export type ImageSlideProps = {
    slide: SlideImage;
    offset?: number;
    render?: Render;
    rect?: ContainerRect;
    imageFit?: ImageFit;
};

export const ImageSlide = ({ slide: image, offset, render, rect, imageFit }: ImageSlideProps) => {
    const [status, setStatus] = React.useState<SlideStatus>(SLIDE_STATUS_LOADING);
    const latestStatus = useLatest(status);

    const { publish } = useEvents();

    const imageRef = React.useRef<HTMLImageElement | null>(null);

    React.useEffect(() => {
        if (offset === 0) {
            publish(activeSlideStatus(status));
        }
    }, [offset, status, publish]);

    const handleLoading = React.useCallback(
        (img: HTMLImageElement) => {
            if (latestStatus.current === SLIDE_STATUS_COMPLETE) {
                return;
            }

            ("decode" in img ? img.decode() : Promise.resolve())
                .catch(() => {})
                .then(() => {
                    if (!img.parentNode) {
                        return;
                    }
                    setStatus(SLIDE_STATUS_COMPLETE);
                });
        },
        [latestStatus]
    );

    const setImageRef = React.useCallback(
        (img: HTMLImageElement | null) => {
            imageRef.current = img;

            if (img?.complete) {
                handleLoading(img);
            }
        },
        [handleLoading]
    );

    const onLoad = React.useCallback(
        (event: React.SyntheticEvent<HTMLImageElement>) => {
            handleLoading(event.currentTarget);
        },
        [handleLoading]
    );

    const onError = React.useCallback(() => {
        setStatus(SLIDE_STATUS_ERROR);
    }, []);

    return (
        <>
            <img
                ref={setImageRef}
                onLoad={onLoad}
                onError={onError}
                className={clsx(
                    cssClass("slide_image"),
                    cssClass("fullsize"),
                    (image.imageFit === "cover" || (image.imageFit !== "contain" && imageFit === "cover")) &&
                        cssClass("slide_image_cover"),
                    status !== SLIDE_STATUS_COMPLETE && cssClass("slide_image_loading")
                )}
                draggable={false}
                alt={image.alt}
                {...(image.srcSet
                    ? {
                          ...(rect && hasWindow()
                              ? {
                                    sizes: `${Math.ceil(
                                        (Math.min(
                                            image.aspectRatio ? rect.height * image.aspectRatio : Number.MAX_VALUE,
                                            rect.width
                                        ) /
                                            window.innerWidth) *
                                            100
                                    )}vw`,
                                }
                              : null),
                          srcSet: image.srcSet
                              .sort((a, b) => a.width - b.width)
                              .map((item) => `${item.src} ${item.width}w`)
                              .join(", "),
                          style: {
                              maxWidth: `${adjustDevicePixelRatio(Math.max(...image.srcSet.map((x) => x.width)))}px`,
                          },
                      }
                    : {
                          style:
                              imageRef.current && imageRef.current?.naturalWidth > 0
                                  ? {
                                        maxWidth: `${adjustDevicePixelRatio(imageRef.current.naturalWidth)}px`,
                                    }
                                  : undefined,
                      })}
                src={image.src}
            />

            {status !== SLIDE_STATUS_COMPLETE && (
                <div className={cssClass("slide_placeholder")}>
                    {status === SLIDE_STATUS_LOADING &&
                        (render?.iconLoading ? (
                            render.iconLoading()
                        ) : (
                            <LoadingIcon className={clsx(cssClass("icon"), cssClass("slide_loading"))} />
                        ))}
                    {status === SLIDE_STATUS_ERROR &&
                        (render?.iconError ? (
                            render.iconError()
                        ) : (
                            <ErrorIcon className={clsx(cssClass("icon"), cssClass("slide_error"))} />
                        ))}
                </div>
            )}
        </>
    );
};
