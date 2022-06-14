import * as React from "react";

import { LightboxProps, Plugin } from "../types.js";
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
} from "../core/index.js";

/** Video slide attributes */
export interface SlideVideo {
    /** video slide type marker */
    type: "video";
    /** video placeholder image */
    poster?: string;
    /** video width in pixels */
    width?: number;
    /** video height in pixels */
    height?: number;
    /** if `true`, the video automatically begins to play */
    autoPlay?: boolean;
    /** if `true`, the browser will offer controls to allow the user to control video playback */
    controls?: boolean;
    /** indicates what controls to show */
    controlsList?: string;
    /** indicates whether to use CORS to fetch the related video */
    crossOrigin?: string;
    /** video preload setting */
    preload?: string;
    /** if `true`, the browser will automatically seek back to the start upon reaching the end of the video */
    loop?: boolean;
    /** the default setting of the audio contained in the video */
    muted?: boolean;
    /** if `true`, the video is to be played "inline", that is within the element's playback area */
    playsInline?: boolean;
    /** prevents the browser from suggesting a Picture-in-Picture context menu */
    disablePictureInPicture?: boolean;
    /** disables the capability of remote playback */
    disableRemotePlayback?: boolean;
    /** an array of video files */
    sources?: {
        /** video source URL */
        src: string;
        /** video source type (e.g., `video/mp4`) */
        type: string;
    }[];
}

declare module "../types.js" {
    interface SlideTypes {
        /** video slide type */
        SlideVideo: SlideVideo;
    }

    interface LightboxProps {
        /** video plugin settings */
        video?: Pick<
            SlideVideo,
            | "autoPlay"
            | "controls"
            | "controlsList"
            | "crossOrigin"
            | "preload"
            | "loop"
            | "muted"
            | "playsInline"
            | "disablePictureInPicture"
            | "disableRemotePlayback"
        >;
    }
}

const defaultVideoProps: LightboxProps["video"] = {
    controls: true,
    playsInline: true,
};

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

    const video = latestProps.current.video ?? defaultVideoProps;

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
        return {
            width: widthBound ? containerRect.width : Math.round((containerRect.height / height) * width),
            height: !widthBound ? containerRect.height : Math.round((containerRect.width / width) * height),
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

/** Video plugin */
export const Video: Plugin = ({ augment }) => {
    augment(({ render: { slide: renderSlide, ...restRender }, video: originalVideo, ...restProps }) => ({
        render: {
            slide: (slide, offset, rect) => {
                if ("type" in slide && slide.type === "video") {
                    return <VideoSlide slide={slide} offset={offset} />;
                }
                return renderSlide?.(slide, offset, rect);
            },
            ...restRender,
        },
        video: {
            ...defaultVideoProps,
            ...originalVideo,
        },
        ...restProps,
    }));
};

export default Video;
