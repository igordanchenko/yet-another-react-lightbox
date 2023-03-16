import * as React from "react";

import { useController } from "../../core/index.js";
import ZoomButtonsGroup from "./ZoomButtonsGroup.js";
import { useZoom } from "./ZoomController.js";

export function ZoomToolbarControl() {
    const { render } = useController().getLightboxProps();
    const zoomRef = useZoom();

    if (render.buttonZoom) {
        return <>{render.buttonZoom(zoomRef)}</>;
    }

    return <ZoomButtonsGroup />;
}
