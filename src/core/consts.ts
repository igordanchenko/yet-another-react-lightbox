export const SLIDE_STATUS_LOADING = "loading";
export const SLIDE_STATUS_PLAYING = "playing";
export const SLIDE_STATUS_ERROR = "error";
export const SLIDE_STATUS_COMPLETE = "complete";

export type SlideStatus =
    | typeof SLIDE_STATUS_LOADING
    | typeof SLIDE_STATUS_PLAYING
    | typeof SLIDE_STATUS_ERROR
    | typeof SLIDE_STATUS_COMPLETE;

export const activeSlideStatus = (status: SlideStatus) => `active-slide-${status}`;

export const ACTIVE_SLIDE_LOADING = activeSlideStatus(SLIDE_STATUS_LOADING);
export const ACTIVE_SLIDE_PLAYING = activeSlideStatus(SLIDE_STATUS_PLAYING);
export const ACTIVE_SLIDE_ERROR = activeSlideStatus(SLIDE_STATUS_ERROR);
export const ACTIVE_SLIDE_COMPLETE = activeSlideStatus(SLIDE_STATUS_COMPLETE);
