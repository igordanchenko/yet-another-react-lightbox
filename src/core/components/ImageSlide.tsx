import * as React from "react";

import { SlideImage } from "../../types.js";
import { clsx, cssClass } from "../utils.js";
import { useLatest } from "../hooks/index.js";
import { ErrorIcon, LoadingIcon } from "./Icons.js";
import { useController } from "../modules/Controller.js";

export const ImageSlide = ({ slide: image }: { slide: SlideImage }) => {
    const [state, setState] = React.useState<"loading" | "error" | "complete">("loading");
    const latestState = useLatest(state);

    const imageRef = React.useRef<HTMLImageElement | null>(null);

    const { containerRect } = useController();

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
                alt={image.title}
                {...(image.srcSet
                    ? {
                          // this approach does not account for carousel padding,
                          // but the margin of error should be negligible in most cases
                          sizes: `${Math.ceil(
                              (Math.min(
                                  image.aspectRatio ? containerRect.height * image.aspectRatio : Number.MAX_VALUE,
                                  containerRect.width
                              ) /
                                  window.innerWidth) *
                                  100
                          )}vw`,
                          srcSet: image.srcSet
                              .sort((a, b) => a.width - b.width)
                              .map((item) => `${item.src} ${item.width}w`)
                              .join(", "),
                          style: {
                              maxWidth: `${Math.max(...image.srcSet.map((x) => x.width))}px`,
                          },
                      }
                    : {
                          style:
                              (imageRef.current?.naturalWidth ?? 0) > 0
                                  ? {
                                        maxWidth: `${imageRef.current?.naturalWidth}px`,
                                    }
                                  : undefined,
                      })}
                src={image.src}
            />

            {state !== "complete" && (
                <div className={cssClass("slide_placeholder")}>
                    {state === "loading" && (
                        <LoadingIcon className={clsx(cssClass("icon"), cssClass("slide_loading"))} />
                    )}
                    {state === "error" && <ErrorIcon className={clsx(cssClass("icon"), cssClass("slide_error"))} />}
                </div>
            )}
        </>
    );
};
