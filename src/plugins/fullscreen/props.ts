import { LightboxProps } from "../../types.js";

export const defaultFullscreenProps = {
    auto: false,
    ref: null,
};

export const resolveFullscreenProps = (fullscreen: LightboxProps["fullscreen"]) => ({
    ...defaultFullscreenProps,
    ...fullscreen,
});
