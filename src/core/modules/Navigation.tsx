import * as React from "react";

import { Component, Labels } from "../../types.js";
import { createModule } from "../config.js";
import { cssClass, label } from "../utils.js";
import { IconButton, NextIcon, PreviousIcon } from "../components/index.js";
import { Publish, useEvents } from "../contexts/index.js";
import { useController } from "./Controller.js";

export type NavigationButtonProps = {
    publish: Publish;
    labels: Labels | undefined;
    buttonLabel: string;
    icon: React.ElementType;
    action: "prev" | "next";
    disabled: boolean | undefined;
};

export const NavigationButton = ({ publish, labels, buttonLabel, icon, action, disabled }: NavigationButtonProps) => (
    <IconButton
        label={label(labels, buttonLabel)}
        icon={icon}
        className={cssClass(`navigation_${action}`)}
        disabled={disabled}
        aria-disabled={disabled}
        onClick={() => {
            publish(action);
        }}
    />
);

export const Navigation: Component = ({ slides, carousel: { finite }, labels }) => {
    const { currentIndex, subscribeSensors } = useController();
    const { publish } = useEvents();

    React.useEffect(
        () =>
            subscribeSensors("onKeyUp", (event) => {
                if (event.code === "ArrowLeft") {
                    publish("prev");
                } else if (event.code === "ArrowRight") {
                    publish("next");
                }
            }),
        [subscribeSensors, publish]
    );

    return (
        <>
            <NavigationButton
                buttonLabel="Previous Image"
                action="prev"
                icon={PreviousIcon}
                disabled={finite && currentIndex === 0}
                labels={labels}
                publish={publish}
            />

            <NavigationButton
                buttonLabel="Next Image"
                action="next"
                icon={NextIcon}
                disabled={finite && currentIndex === slides.length - 1}
                labels={labels}
                publish={publish}
            />
        </>
    );
};

export const NavigationModule = createModule("navigation", Navigation);
