import * as React from "react";

import {
    ACTIVE_SLIDE_COMPLETE,
    ACTIVE_SLIDE_LOADING,
    ACTIVE_SLIDE_PLAYING,
    clsx,
    cssClass,
    useContainerRect,
    useController,
    useEvents,
    useLatest,
} from "../../core/index.js";
import { LightboxProps } from "../../types.js";
import { SlideVideo } from "./index.js";
import { defaultVideoProps } from "./Video.js";

type VideoSlideProps = {
    slide: SlideVideo;
    offset: number;
};

/** Video slide */
export const VideoSlide: React.FC<VideoSlideProps> = ({ slide, offset }) => {
    const { latestProps } = useController();
    const { publish } = useEvents();
    const { setContainerRef, containerRect } = useContainerRect();
    const videoRef = React.useRef<HTMLVideoElement | null>(null);

    const video = { ...defaultVideoProps, ...latestProps.current.video };

    React.useEffect(() => {
        if (offset !== 0 && videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
        }
    }, [offset]);

    React.useEffect(() => {
        if (offset === 0 && videoRef.current && (slide.autoPlay || video.autoPlay)) {
            publish(ACTIVE_SLIDE_LOADING);

            videoRef.current.play().catch(() => {});
        }
    }, [offset, video.autoPlay, slide.autoPlay, publish]);

    const latestOffset = useLatest(offset);
    const latestVideoAutoPlay = useLatest(video.autoPlay);
    const latestSlideAutoPlay = useLatest(slide.autoPlay);

    const setVideoRef = React.useCallback(
        (el: HTMLVideoElement | null) => {
            videoRef.current = el;

            if (
                el &&
                latestOffset.current === 0 &&
                (latestVideoAutoPlay.current || latestSlideAutoPlay.current) &&
                el.paused
            ) {
                el.play().catch(() => {});
            }
        },
        [latestOffset, latestVideoAutoPlay, latestSlideAutoPlay]
    );

    const { width, height, poster, sources } = slide;

    const scaleWidthAndHeight = () => {
        if (!width || !height || !containerRect) return null;

        const widthBound = width / height > containerRect.width / containerRect.height;
        const elementWidth = widthBound ? containerRect.width : Math.round((containerRect.height / height) * width);
        const elementHeight = !widthBound ? containerRect.height : Math.round((containerRect.width / width) * height);

        return {
            width: elementWidth,
            height: elementHeight,
            style: { width: elementWidth, height: elementHeight, maxWidth: "100%", maxHeight: "100%" },
        };
    };

    const resolveBoolean = (attr: keyof Required<Pick<LightboxProps, "video">>["video"]) => {
        if (slide[attr] === false) return null;
        if (slide[attr] === true) return { [attr]: true };
        if (video[attr] === false) return null;
        if (video[attr] === true) return { [attr]: true };
        return null;
    };

    const resolveString = (attr: keyof Required<Pick<LightboxProps, "video">>["video"]) => {
        if (video[attr] || slide[attr]) {
            return { [attr]: slide[attr] || video[attr] };
        }
        return null;
    };

    return (
        <>
            {sources && (
                <div
                    ref={setContainerRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        // not adjusting for devicePixelRatio for now since videos do not look that pixelated
                        // even without devicePixelRatio adjustment
                        ...(width ? { maxWidth: `${width}px` } : null),
                    }}
                    className={clsx(cssClass("video_container"), cssClass("flex_center"))}
                >
                    {containerRect && (
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <video
                            ref={setVideoRef}
                            poster={poster}
                            {...scaleWidthAndHeight()}
                            {...resolveBoolean("controls")}
                            {...resolveBoolean("playsInline")}
                            {...resolveBoolean("loop")}
                            {...resolveBoolean("muted")}
                            {...resolveBoolean("playsInline")}
                            {...resolveBoolean("disablePictureInPicture")}
                            {...resolveBoolean("disableRemotePlayback")}
                            {...resolveString("controlsList")}
                            {...resolveString("crossOrigin")}
                            {...resolveString("preload")}
                            onPlay={() => {
                                publish(ACTIVE_SLIDE_PLAYING);
                            }}
                            onEnded={() => {
                                publish(ACTIVE_SLIDE_COMPLETE);
                            }}
                        >
                            {sources.map(({ src, type }, index) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <source key={index} src={src} type={type} />
                            ))}
                        </video>
                    )}
                </div>
            )}
        </>
    );
};
