import * as React from "react";

const WHEEL = "wheel";

function preventDefault(event: WheelEvent) {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.ctrlKey) {
        event.preventDefault();
    }
}

/** prevent browser back/forward navigation on touchpad left/right swipe (especially noticeable in Safari)
 * this has to be done via non-passive native event handler */
export function usePreventSwipeNavigation<T extends HTMLElement = HTMLElement>() {
    const ref = React.useRef<T | null>(null);

    return React.useCallback((node: T | null) => {
        if (node) {
            node.addEventListener(WHEEL, preventDefault, { passive: false });
        } else {
            ref.current?.removeEventListener(WHEEL, preventDefault);
        }

        ref.current = node;
    }, []);
}
