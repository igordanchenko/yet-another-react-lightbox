import * as React from "react";

import { useLightboxProps } from "../../core/index.js";
import ZoomButtonsGroup from "./ZoomButtonsGroup.js";
import { useZoom } from "./ZoomController.js";

export function ZoomToolbarControl() {
    const { render } = useLightboxProps();
    const zoomRef = useZoom();

    if (render.buttonZoom) {
        return <>{render.buttonZoom(zoomRef)}</>;
    }

    return <ZoomButtonsGroup />;
}
