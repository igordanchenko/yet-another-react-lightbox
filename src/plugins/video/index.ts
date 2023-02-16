import { GenericSlide } from "../../types.js";
import { Video } from "./Video.js";
import {
    ACTIVE_SLIDE_COMPLETE,
    ACTIVE_SLIDE_ERROR,
    ACTIVE_SLIDE_LOADING,
    ACTIVE_SLIDE_PLAYING,
} from "../../core/consts.js";

/** Video slide attributes */
export interface SlideVideo extends GenericSlide {
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
    sources: {
        /** video source URL */
        src: string;
        /** video source type (e.g., `video/mp4`) */
        type: string;
    }[];
}

declare module "../../types" {
    // noinspection JSUnusedGlobalSymbols
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

declare module "../../core" {
    // noinspection JSUnusedGlobalSymbols
    interface EventTypes {
        [ACTIVE_SLIDE_LOADING]: void;
        [ACTIVE_SLIDE_PLAYING]: void;
        [ACTIVE_SLIDE_COMPLETE]: void;
        [ACTIVE_SLIDE_ERROR]: void;
    }
}

export default Video;
