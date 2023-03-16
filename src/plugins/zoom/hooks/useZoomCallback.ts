import * as React from "react";

import { useController, useEventCallback } from "../../../core/index.js";

export function useZoomCallback(zoom: number, disabled: boolean) {
    const { on } = useController().getLightboxProps();

    const onZoomCallback = useEventCallback(() => {
        if (!disabled) {
            on.zoom?.({ zoom });
        }
    });

    React.useEffect(onZoomCallback, [zoom, onZoomCallback]);
}
