import * as React from "react";
import { IMAGE_FIT_CONTAIN, IMAGE_FIT_COVER } from "./consts.js";
import {
    ContainerRect,
    Labels,
    LengthOrPercentage,
    LightboxProps,
    Slide,
    SlideImage,
    ToolbarSettings,
} from "../types.js";

export const clsx = (...classes: (string | boolean | undefined)[]) =>
    [...classes].filter((cls) => Boolean(cls)).join(" ");

const cssPrefix = "yarl__";

export const cssClass = (name: string) => `${cssPrefix}${name}`;

export const cssVar = (name: string) => `--${cssPrefix}${name}`;

export const composePrefix = (base: string, prefix?: string) => `${base}${prefix ? `_${prefix}` : ""}`;

export const makeComposePrefix = (base: string) => (prefix?: string) => composePrefix(base, prefix);

export const label = (labels: Labels | undefined, lbl: string) => (labels && labels[lbl] ? labels[lbl] : lbl);

export const cleanup =
    (...cleaners: (() => void)[]) =>
    () => {
        cleaners.forEach((cleaner) => {
            cleaner();
        });
    };

export const makeUseContext =
    <T>(name: string, contextName: string, context: React.Context<T | null>) =>
    () => {
        const ctx = React.useContext(context);
        if (!ctx) {
            throw new Error(`${name} must be used within a ${contextName}.Provider`);
        }
        return ctx;
    };

export const hasWindow = () => typeof window !== "undefined";

export function round(value: number, decimals = 0) {
    const factor = 10 ** decimals;
    return Math.round((value + Number.EPSILON) * factor) / factor;
}

export const isImageSlide = (slide: Slide): slide is SlideImage => slide.type === undefined || slide.type === "image";

export const isImageFitCover = (image: SlideImage, imageFit?: LightboxProps["carousel"]["imageFit"]) =>
    image.imageFit === IMAGE_FIT_COVER || (image.imageFit !== IMAGE_FIT_CONTAIN && imageFit === IMAGE_FIT_COVER);

export function parseLengthPercentage(input: LengthOrPercentage) {
    if (typeof input === "number") {
        return { pixel: input };
    }

    // noinspection SuspiciousTypeOfGuard
    if (typeof input === "string") {
        const value = parseInt(input, 10);
        return input.endsWith("%") ? { percent: value } : { pixel: value };
    }

    return { pixel: 0 };
}

export function computeSlideRect(containerRect: ContainerRect, padding: LengthOrPercentage) {
    const paddingValue = parseLengthPercentage(padding);
    const paddingPixels =
        paddingValue.percent !== undefined ? (containerRect.width / 100) * paddingValue.percent : paddingValue.pixel;
    return {
        width: Math.max(containerRect.width - 2 * paddingPixels, 0),
        height: Math.max(containerRect.height - 2 * paddingPixels, 0),
    };
}

export const devicePixelRatio = () => (hasWindow() ? window?.devicePixelRatio : undefined) || 1;

export const getSlideIndex = (index: number, slidesCount: number) =>
    slidesCount > 0 ? ((index % slidesCount) + slidesCount) % slidesCount : 0;

export const hasSlides = (slides: Slide[]): slides is [Slide, ...Slide[]] => slides.length > 0;

export const getSlide = (slides: [Slide, ...Slide[]], index: number) => slides[getSlideIndex(index, slides.length)];

export const getSlideIfPresent = (slides: Slide[], index: number) =>
    hasSlides(slides) ? getSlide(slides, index) : undefined;

export function addToolbarButton(toolbar: ToolbarSettings, key: string, button: React.ReactNode) {
    if (!button) return toolbar;

    const { buttons, ...restToolbar } = toolbar;
    const index = buttons.findIndex((item) => item === key);
    const buttonWithKey = React.isValidElement(button) ? React.cloneElement(button, { key }, null) : button;

    if (index >= 0) {
        const result = [...buttons];
        result.splice(index, 1, buttonWithKey);
        return { buttons: result, ...restToolbar };
    }

    return { buttons: [buttonWithKey, ...buttons], ...restToolbar };
}
