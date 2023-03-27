import { LightboxProps } from "../../types.js";
import { useLightboxProps } from "../../core/index.js";

export const defaultCaptionsProps = {
    descriptionTextAlign: "start" as const,
    descriptionMaxLines: 3,
    showToggle: false,
};

export const resolveCaptionsProps = (captions: LightboxProps["captions"]) => ({
    ...defaultCaptionsProps,
    ...captions,
});

export function useCaptionsProps() {
    const { captions } = useLightboxProps();
    return resolveCaptionsProps(captions);
}
