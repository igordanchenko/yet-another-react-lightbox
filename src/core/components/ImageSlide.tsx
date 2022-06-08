import * as React from "react";

import { Render, SlideImage } from "../../types.js";
import { adjustDevicePixelRatio, clsx, cssClass, hasWindow } from "../utils.js";
import { ContainerRect, useLatest } from "../hooks/index.js";
import { ErrorIcon, LoadingIcon } from "./Icons.js";

export type ImageSlideProps = {
    slide: SlideImage;
    render?: Render;
    rect?: ContainerRect;
};

export const ImageSlide = ({ slide: image, render, rect }: ImageSlideProps) => {
    const [state, setState] = React.useState<"loading" | "error" | "complete">("loading");
    const latestState = useLatest(state);

    const imageRef = React.useRef<HTMLImageElement | null>(null);

    const handleLoading = React.useCallback(
        (img: HTMLImageElement) => {
            if (latestState.current === "complete") {
                return;
            }

            ("decode" in img ? img.decode() : Promise.resolve())
                .catch(() => {})
                .then(() => {
                    if (!img.parentNode) {
                        return;
                    }
                    setState("complete");
                });
        },
        [latestState]
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
        setState("error");
    }, []);

    return (
        <>
            <img
                ref={setImageRef}
                onLoad={onLoad}
                onError={onError}
                className={clsx(cssClass("slide_image"), state !== "complete" && cssClass("slide_image_loading"))}
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

            {state !== "complete" && (
                <div className={cssClass("slide_placeholder")}>
                    {state === "loading" &&
                        (render?.iconLoading ? (
                            render.iconLoading()
                        ) : (
                            <LoadingIcon className={clsx(cssClass("icon"), cssClass("slide_loading"))} />
                        ))}
                    {state === "error" &&
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
