import * as React from "react";

import {
    devicePixelRatio,
    IMAGE_FIT_CONTAIN,
    IMAGE_FIT_COVER,
    ImageSlide,
    ImageSlideProps,
    useEventCallback,
    useLayoutEffect,
} from "../../core/index.js";
import { ImageSource, SlideImage } from "../../types.js";

type ResponsiveImageSlide = Omit<SlideImage, "srcSet"> & {
    srcSet: [ImageSource, ...ImageSource[]];
};

export const isResponsiveImageSlide = (slide: SlideImage): slide is ResponsiveImageSlide =>
    (slide.srcSet?.length || 0) > 0;

type ResponsiveImageProps = Omit<ImageSlideProps, "slide" | "rect"> &
    Required<Pick<ImageSlideProps, "rect">> & {
        slide: ResponsiveImageSlide;
    };

export const ResponsiveImage: React.FC<ResponsiveImageProps> = (props) => {
    const [state, setState] = React.useState<{ current?: string; preload?: string }>({});
    const { current, preload } = state;

    const { slide: image, rect, imageFit, render } = props;

    const srcSet = image.srcSet.sort((a, b) => a.width - b.width);
    const width = image.width ?? srcSet[srcSet.length - 1].width;
    const height = image.height ?? srcSet[srcSet.length - 1].height;
    const cover =
        image.imageFit === IMAGE_FIT_COVER || (image.imageFit !== IMAGE_FIT_CONTAIN && imageFit === IMAGE_FIT_COVER);
    const maxWidth = Math.max(...srcSet.map((x) => x.width));
    const targetWidth = Math.min((cover ? Math.max : Math.min)(rect.width, width * (rect.height / height)), maxWidth);
    const pixelDensity = devicePixelRatio();

    const handleSourceChange = useEventCallback(() => {
        const targetSource = srcSet.find((x) => x.width >= targetWidth * pixelDensity) ?? srcSet[srcSet.length - 1];

        if (!current) {
            setState((prev) => ({ ...prev, current: targetSource.src }));
        } else if (srcSet.findIndex((x) => x.src === current) < srcSet.findIndex((x) => x === targetSource)) {
            setState((prev) => ({ ...prev, preload: targetSource.src }));
        }
    });

    useLayoutEffect(handleSourceChange, [rect?.width, rect?.height, pixelDensity, handleSourceChange]);

    const handlePreload = useEventCallback((currentPreload: string) => {
        if (currentPreload === preload) {
            setState((prev) => ({ ...prev, current: preload, preload: undefined }));
        }
    });

    const style = {
        // workaround occasional flickering in mobile Safari
        "-webkit-transform": "translateZ(0)",
        ...(rect.width / rect.height < width / height
            ? {
                  width: "100%",
                  height: "auto",
              }
            : { width: "auto", height: "100%" }),
    };

    return (
        <>
            {preload && preload !== current && (
                <ImageSlide
                    key={preload}
                    {...props}
                    slide={{ ...image, src: preload, srcSet: undefined }}
                    style={{ position: "absolute", visibility: "hidden", ...style }}
                    onLoad={() => handlePreload(preload)}
                    render={{
                        ...render,
                        iconLoading: () => null,
                        iconError: () => null,
                    }}
                />
            )}

            {current && (
                <ImageSlide
                    key={current}
                    {...props}
                    slide={{ ...image, src: current, srcSet: undefined }}
                    style={style}
                />
            )}
        </>
    );
};
