import * as React from "react";

import { Component } from "../../types.js";
import { createModule } from "../config.js";
import { cssClass, label } from "../utils.js";
import { useEvents } from "../contexts/index.js";
import { CloseIcon, IconButton } from "../components/index.js";

export const Toolbar: Component = ({ toolbar: { buttons }, labels, render: { buttonClose, iconClose } }) => {
    const { publish } = useEvents();

    const renderCloseButton = () =>
        buttonClose ? (
            buttonClose()
        ) : (
            <IconButton
                key="close"
                label={label(labels, "Close")}
                icon={CloseIcon}
                renderIcon={iconClose}
                onClick={() => publish("close")}
            />
        );

    return (
        <div className={cssClass("toolbar")}>
            {buttons?.map((button) => (button === "close" ? renderCloseButton() : button))}
        </div>
    );
};

export const ToolbarModule = createModule("toolbar", Toolbar);
