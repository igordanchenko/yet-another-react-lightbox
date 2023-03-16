import { LightboxProps } from "../../types.js";

export const defaultCaptionsProps = {
    descriptionTextAlign: "start" as const,
    descriptionMaxLines: 3,
};

export const resolveCaptionsProps = (captions: LightboxProps["captions"]) => ({
    ...defaultCaptionsProps,
    ...captions,
});
