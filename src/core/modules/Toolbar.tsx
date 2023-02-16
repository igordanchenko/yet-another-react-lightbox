import * as React from "react";

import { Component } from "../../types.js";
import { createModule } from "../config.js";
import { composePrefix, cssClass, label } from "../utils.js";
import { useEvents } from "../contexts/index.js";
import { CloseIcon, IconButton } from "../components/index.js";
import { useContainerRect } from "../hooks/useContainerRect.js";
import { ACTION_CLOSE, MODULE_TOOLBAR, YARL_EVENT_TOOLBAR_WIDTH } from "../consts.js";

declare module "../" {
    // noinspection JSUnusedGlobalSymbols
    interface EventTypes {
        [YARL_EVENT_TOOLBAR_WIDTH]: number;
    }
}

const cssPrefix = (value?: string) => composePrefix(MODULE_TOOLBAR, value);

export const Toolbar: Component = ({ toolbar: { buttons }, labels, render: { buttonClose, iconClose } }) => {
    const { publish } = useEvents();
    const { setContainerRef, containerRect } = useContainerRect();

    React.useEffect(() => {
        if (containerRect?.width) {
            publish(YARL_EVENT_TOOLBAR_WIDTH, containerRect.width);
        }
    }, [publish, containerRect?.width]);

    const renderCloseButton = () =>
        buttonClose ? (
            buttonClose()
        ) : (
            <IconButton
                key={ACTION_CLOSE}
                label={label(labels, "Close")}
                icon={CloseIcon}
                renderIcon={iconClose}
                onClick={() => publish(ACTION_CLOSE)}
            />
        );

    return (
        <div ref={setContainerRef} className={cssClass(cssPrefix())}>
            {buttons?.map((button) => (button === ACTION_CLOSE ? renderCloseButton() : button))}
        </div>
    );
};

export const ToolbarModule = createModule(MODULE_TOOLBAR, Toolbar);
