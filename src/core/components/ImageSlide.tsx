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

    const cover = image.imageFit === "cover" || (image.imageFit !== "contain" && imageFit === "cover");

    const nonInfinite = (value: number, fallback: number) => (Number.isFinite(value) ? value : fallback);

    const maxWidth = adjustDevicePixelRatio(
        nonInfinite(
            Math.max(...(image.srcSet?.map((x) => x.width) ?? []).concat(image.width ? [image.width] : [])),
            imageRef.current?.naturalWidth || 0
        )
    );
    const maxHeight = adjustDevicePixelRatio(
        nonInfinite(
            Math.max(
                ...(image.srcSet?.map((x) => x.height).filter((x): x is number => Boolean(x)) ?? []).concat(
                    image.height ? [image.height] : []
                )
            ),
            // TODO v2: remove aspectRatio
            (image.aspectRatio && maxWidth ? maxWidth / image.aspectRatio : imageRef.current?.naturalHeight) || 0
        )
    );

    const style = maxWidth && maxHeight ? { maxWidth, maxHeight } : undefined;

    const srcSet = image.srcSet
        ?.sort((a, b) => a.width - b.width)
        .map((item) => `${item.src} ${item.width}w`)
        .join(", ");

    const estimateActualWidth = () => {
        if (rect && !cover) {
            if (image.width && image.height) {
                return (rect.height / image.height) * image.width;
            }
            if (image.aspectRatio) {
                return rect.height * image.aspectRatio;
            }
        }
        return Number.MAX_VALUE;
    };

    const sizes =
        srcSet && rect && hasWindow()
            ? `${Math.ceil((Math.min(estimateActualWidth(), rect.width) / window.innerWidth) * 100)}vw`
            : undefined;

    return (
        <>
            <img
                ref={setImageRef}
                onLoad={onLoad}
                onError={onError}
                className={clsx(
                    cssClass("slide_image"),
                    cssClass("fullsize"),
                    cover && cssClass("slide_image_cover"),
                    status !== SLIDE_STATUS_COMPLETE && cssClass("slide_image_loading")
                )}
                draggable={false}
                alt={image.alt}
                style={style}
                sizes={sizes}
                srcSet={srcSet}
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
