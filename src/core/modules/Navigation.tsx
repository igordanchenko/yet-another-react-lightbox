import * as React from "react";

import { Component, Labels } from "../../types.js";
import { createModule } from "../config.js";
import { cssClass, label as translateLabel } from "../utils.js";
import { IconButton, NextIcon, PreviousIcon } from "../components/index.js";
import { Publish, useEvents } from "../contexts/index.js";
import { useController } from "./Controller.js";

export type NavigationButtonProps = {
    publish: Publish;
    labels?: Labels;
    label: string;
    icon: React.ElementType;
    renderIcon?: () => React.ReactNode;
    action: "prev" | "next";
    disabled?: boolean;
};

export const NavigationButton = ({
    publish,
    labels,
    label,
    icon,
    renderIcon,
    action,
    disabled,
}: NavigationButtonProps) => (
    <IconButton
        label={translateLabel(labels, label)}
        icon={icon}
        renderIcon={renderIcon}
        className={cssClass(`navigation_${action}`)}
        disabled={disabled}
        aria-disabled={disabled}
        onClick={() => {
            publish(action);
        }}
    />
);

export const Navigation: Component = ({
    slides,
    carousel: { finite },
    labels,
    render: { buttonPrev, buttonNext, iconPrev, iconNext },
}) => {
    const { currentIndex, subscribeSensors, isRTL } = useController();
    const { publish } = useEvents();

    React.useEffect(
        () =>
            subscribeSensors("onKeyUp", (event) => {
                if (event.code === "ArrowLeft") {
                    publish(isRTL ? "next" : "prev");
                } else if (event.code === "ArrowRight") {
                    publish(isRTL ? "prev" : "next");
                }
            }),
        [subscribeSensors, publish, isRTL]
    );

    return (
        <>
            {buttonPrev ? (
                buttonPrev()
            ) : (
                <NavigationButton
                    label="Previous"
                    action="prev"
                    icon={PreviousIcon}
                    renderIcon={iconPrev}
                    disabled={finite && currentIndex === 0}
                    labels={labels}
                    publish={publish}
                />
            )}

            {buttonNext ? (
                buttonNext()
            ) : (
                <NavigationButton
                    label="Next"
                    action="next"
                    icon={NextIcon}
                    renderIcon={iconNext}
                    disabled={finite && currentIndex === slides.length - 1}
                    labels={labels}
                    publish={publish}
                />
            )}
        </>
    );
};

export const NavigationModule = createModule("navigation", Navigation);
