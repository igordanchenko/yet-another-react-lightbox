import { useController } from "../../../core/index.js";
import { resolveZoomProps } from "../props.js";

export function useZoomProps() {
    const { zoom } = useController().getLightboxProps();
    return resolveZoomProps(zoom);
}
