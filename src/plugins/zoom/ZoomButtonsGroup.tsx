import * as React from "react";

import { useController } from "../../core/index.js";
import { ZoomButton } from "./ZoomButton.js";

export default function ZoomButtonsGroup() {
    const zoomInRef = React.useRef<HTMLButtonElement>(null);
    const zoomOutRef = React.useRef<HTMLButtonElement>(null);

    const { focus } = useController();

    const focusSibling = React.useCallback(
        (sibling: React.RefObject<HTMLButtonElement>) => {
            if (!sibling.current?.disabled) {
                sibling.current?.focus();
            } else {
                focus();
            }
        },
        [focus]
    );

    const focusZoomIn = React.useCallback(() => focusSibling(zoomInRef), [focusSibling]);
    const focusZoomOut = React.useCallback(() => focusSibling(zoomOutRef), [focusSibling]);

    return (
        <>
            <ZoomButton zoomIn ref={zoomInRef} onLoseFocus={focusZoomOut} />
            <ZoomButton ref={zoomOutRef} onLoseFocus={focusZoomIn} />
        </>
    );
}
