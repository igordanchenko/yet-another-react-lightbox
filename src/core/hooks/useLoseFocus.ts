import * as React from "react";

import { useLayoutEffect } from "./useLayoutEffect.js";
import { useController } from "../modules/Controller.js";

export function useLoseFocus(disabled = false) {
    const focused = React.useRef(disabled);

    const { transferFocus } = useController();

    useLayoutEffect(() => {
        if (disabled) {
            transferFocus();
        }
    }, [disabled, transferFocus]);

    const onFocus = React.useCallback(() => {
        focused.current = true;
    }, []);

    const onBlur = React.useCallback(() => {
        focused.current = false;
    }, []);

    return { onFocus, onBlur };
}
