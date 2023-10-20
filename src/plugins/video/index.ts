import { GenericSlide } from "../../index.js";
import { Video } from "./Video.js";

declare module "../../types.js" {
  // noinspection JSUnusedGlobalSymbols
  interface SlideTypes {
    /** video slide type */
    video: SlideVideo;
  }

  /** Video slide attributes */
  export interface SlideVideo extends GenericSlide {
    /** video slide type */
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

export default Video;
