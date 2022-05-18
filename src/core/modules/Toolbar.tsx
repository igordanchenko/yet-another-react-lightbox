import * as React from "react";

import { Component } from "../../types.js";
import { createModule } from "../config.js";
import { cssClass, label } from "../utils.js";
import { useEvents } from "../contexts/index.js";
import { CloseIcon, IconButton } from "../components/index.js";

export const Toolbar: Component = ({ toolbar: { buttons }, labels }) => {
    const { publish } = useEvents();

    return (
        <div className={cssClass("toolbar")}>
            {buttons?.map((button) =>
                button === "close" ? (
                    <IconButton
                        key="close"
                        label={label(labels, "Close")}
                        icon={CloseIcon}
                        onClick={() => publish("close")}
                    />
                ) : (
                    button
                )
            )}
        </div>
    );
};

export const ToolbarModule = createModule("toolbar", Toolbar);
