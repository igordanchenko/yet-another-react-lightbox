import { useLightboxProps } from "../../../core/index.js";
import { resolveZoomProps } from "../props.js";

export function useZoomProps() {
    const { zoom } = useLightboxProps();
    return resolveZoomProps(zoom);
}
