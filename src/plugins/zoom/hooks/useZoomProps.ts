import { LightboxProps } from "../../../types.js";
import { useController } from "../../../core/index.js";
import { defaultZoomProps } from "../props.js";

export function resolveZoomProps(zoom: LightboxProps["zoom"]) {
    return { ...defaultZoomProps, ...zoom };
}

export function useZoomProps() {
    const { zoom } = useController().getLightboxProps();
    return resolveZoomProps(zoom);
}
