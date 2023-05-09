import * as React from "react";

import { ComponentProps } from "../types.js";
import { createModule } from "../config.js";
import { useLayoutEffect } from "../hooks/index.js";
import { composePrefix, cssClass, stopNavigationEventsPropagation } from "../utils.js";
import { CloseIcon, IconButton } from "../components/index.js";
import { useContainerRect } from "../hooks/useContainerRect.js";
import { useController } from "./Controller.js";
import { ACTION_CLOSE, MODULE_TOOLBAR } from "../consts.js";

function cssPrefix(value?: string) {
    return composePrefix(MODULE_TOOLBAR, value);
}

export function Toolbar({ toolbar: { buttons }, render: { buttonClose, iconClose } }: ComponentProps) {
    const { close, setToolbarWidth } = useController();
    const { setContainerRef, containerRect } = useContainerRect();

    useLayoutEffect(() => {
        setToolbarWidth(containerRect?.width);
    }, [setToolbarWidth, containerRect?.width]);

    const renderCloseButton = () => {
        if (buttonClose) return buttonClose();

        return <IconButton key={ACTION_CLOSE} label="Close" icon={CloseIcon} renderIcon={iconClose} onClick={close} />;
    };

    return (
        <div ref={setContainerRef} className={cssClass(cssPrefix())} {...stopNavigationEventsPropagation()}>
            {buttons?.map((button) => (button === ACTION_CLOSE ? renderCloseButton() : button))}
        </div>
    );
}

export const ToolbarModule = createModule(MODULE_TOOLBAR, Toolbar);
