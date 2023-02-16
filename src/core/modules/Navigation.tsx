import * as React from "react";

import { Component, Labels } from "../../types.js";
import { createModule } from "../config.js";
import { useEventCallback, useRTL } from "../hooks/index.js";
import { cssClass, label as translateLabel } from "../utils.js";
import { IconButton, NextIcon, PreviousIcon } from "../components/index.js";
import { Publish, useEvents, useLightboxState } from "../contexts/index.js";
import { useController } from "./Controller.js";
import {
    ACTION_NEXT,
    ACTION_PREV,
    EVENT_ON_KEY_DOWN,
    MODULE_NAVIGATION,
    VK_ARROW_LEFT,
    VK_ARROW_RIGHT,
} from "../consts.js";

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
    const { currentIndex } = useLightboxState().state;
    const { subscribeSensors } = useController();
    const { publish } = useEvents();
    const isRTL = useRTL();

    const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
        if (event.key === VK_ARROW_LEFT) {
            publish(isRTL ? ACTION_NEXT : ACTION_PREV);
        } else if (event.key === VK_ARROW_RIGHT) {
            publish(isRTL ? ACTION_PREV : ACTION_NEXT);
        }
    });

    React.useEffect(() => subscribeSensors(EVENT_ON_KEY_DOWN, handleKeyDown), [subscribeSensors, handleKeyDown]);

    return (
        <>
            {buttonPrev ? (
                buttonPrev()
            ) : (
                <NavigationButton
                    label="Previous"
                    action={ACTION_PREV}
                    icon={PreviousIcon}
                    renderIcon={iconPrev}
                    disabled={slides.length === 0 || (finite && currentIndex === 0)}
                    labels={labels}
                    publish={publish}
                />
            )}

            {buttonNext ? (
                buttonNext()
            ) : (
                <NavigationButton
                    label="Next"
                    action={ACTION_NEXT}
                    icon={NextIcon}
                    renderIcon={iconNext}
                    disabled={slides.length === 0 || (finite && currentIndex === slides.length - 1)}
                    labels={labels}
                    publish={publish}
                />
            )}
        </>
    );
};

export const NavigationModule = createModule(MODULE_NAVIGATION, Navigation);
