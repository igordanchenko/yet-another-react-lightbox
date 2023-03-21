import * as React from "react";

import { ComponentProps, Labels } from "../../types.js";
import { createModule } from "../config.js";
import { useEventCallback, useLoseFocus, useRTL, useThrottle } from "../hooks/index.js";
import { cssClass, getNavigationAnimationDuration, label as translateLabel } from "../utils.js";
import { IconButton, NextIcon, PreviousIcon } from "../components/index.js";
import { useEvents, useLightboxState } from "../contexts/index.js";
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
    labels?: Labels;
    label: string;
    icon: React.ElementType;
    renderIcon?: () => React.ReactNode;
    action: "prev" | "next";
    onClick: () => void;
    disabled?: boolean;
};

export function NavigationButton({
    labels,
    label,
    icon,
    renderIcon,
    action,
    onClick,
    disabled,
}: NavigationButtonProps) {
    return (
        <IconButton
            label={translateLabel(labels, label)}
            icon={icon}
            renderIcon={renderIcon}
            className={cssClass(`navigation_${action}`)}
            disabled={disabled}
            onClick={onClick}
            {...useLoseFocus(disabled)}
        />
    );
}

export function Navigation({
    carousel: { finite },
    animation,
    labels,
    render: { buttonPrev, buttonNext, iconPrev, iconNext },
}: ComponentProps) {
    const { slides, currentIndex } = useLightboxState().state;
    const { subscribeSensors } = useController();
    const { publish } = useEvents();
    const isRTL = useRTL();

    const prevDisabled = slides.length === 0 || (finite && currentIndex === 0);
    const nextDisabled = slides.length === 0 || (finite && currentIndex === slides.length - 1);

    const publishThrottled = useThrottle(
        (action: typeof ACTION_PREV | typeof ACTION_NEXT) => publish(action),
        getNavigationAnimationDuration(animation) / 2
    );

    const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
        if (event.key === VK_ARROW_LEFT && !(isRTL ? nextDisabled : prevDisabled)) {
            publishThrottled(isRTL ? ACTION_NEXT : ACTION_PREV);
        }
        if (event.key === VK_ARROW_RIGHT && !(isRTL ? prevDisabled : nextDisabled)) {
            publishThrottled(isRTL ? ACTION_PREV : ACTION_NEXT);
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
                    disabled={prevDisabled}
                    labels={labels}
                    onClick={() => publish(ACTION_PREV)}
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
                    disabled={nextDisabled}
                    labels={labels}
                    onClick={() => publish(ACTION_NEXT)}
                />
            )}
        </>
    );
}

export const NavigationModule = createModule(MODULE_NAVIGATION, Navigation);
