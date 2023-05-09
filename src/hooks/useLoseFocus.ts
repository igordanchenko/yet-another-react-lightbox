import * as React from "react";

import { useLayoutEffect } from "./useLayoutEffect.js";
import { useController } from "../modules/Controller.js";

export function useLoseFocus(disabled = false) {
    const focused = React.useRef(disabled);

    const { focus } = useController();

    useLayoutEffect(() => {
        if (disabled) {
            focus();
        }
    }, [disabled, focus]);

    const onFocus = React.useCallback(() => {
        focused.current = true;
    }, []);

    const onBlur = React.useCallback(() => {
        focused.current = false;
    }, []);

    return { onFocus, onBlur };
}
