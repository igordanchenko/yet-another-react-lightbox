import * as React from "react";

import { LightboxProps } from "../../types.js";
import { useController } from "../../core/index.js";
import { ZoomButton } from "./ZoomButton.js";

type ZoomButtonsGroupProps = Pick<LightboxProps, "labels" | "render">;

export const ZoomButtonsGroup: React.FC<ZoomButtonsGroupProps> = ({ labels, render }) => {
    const zoomInRef = React.useRef<HTMLButtonElement>(null);
    const zoomOutRef = React.useRef<HTMLButtonElement>(null);
    const { transferFocus } = useController();

    const focusSibling = React.useCallback(
        (sibling: React.RefObject<HTMLButtonElement>) => {
            if (!sibling.current?.disabled) {
                sibling.current?.focus();
            } else {
                transferFocus();
            }
        },
        [transferFocus]
    );

    const focusZoomIn = React.useCallback(() => focusSibling(zoomInRef), [focusSibling]);

    const focusZoomOut = React.useCallback(() => focusSibling(zoomOutRef), [focusSibling]);

    return (
        <>
            <ZoomButton
                ref={zoomInRef}
                key="zoomIn"
                zoomIn
                labels={labels}
                render={render}
                onLoseFocus={focusZoomOut}
            />
            <ZoomButton ref={zoomOutRef} key="zoomOut" labels={labels} render={render} onLoseFocus={focusZoomIn} />
        </>
    );
};
