import * as React from "react";

import { ComponentProps, RenderFunction } from "../types.js";
import { createModule } from "../config.js";
import { useEventCallback, useLoseFocus, useRTL, useThrottle } from "../hooks/index.js";
import { cssClass } from "../utils.js";
import { IconButton, NextIcon, PreviousIcon } from "../components/index.js";
import { useLightboxState } from "../contexts/index.js";
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
    label: string;
    icon: React.ElementType;
    renderIcon?: RenderFunction;
    action: "prev" | "next";
    onClick: () => void;
    disabled?: boolean;
};

export function NavigationButton({ label, icon, renderIcon, action, onClick, disabled }: NavigationButtonProps) {
    return (
        <IconButton
            label={label}
            icon={icon}
            renderIcon={renderIcon}
            className={cssClass(`navigation_${action}`)}
            disabled={disabled}
            onClick={onClick}
            {...useLoseFocus(useController().focus, disabled)}
        />
    );
}

export function Navigation({
    carousel: { finite },
    animation,
    render: { buttonPrev, buttonNext, iconPrev, iconNext },
}: ComponentProps) {
    const { slides, currentIndex } = useLightboxState();
    const { prev, next, subscribeSensors } = useController();
    const isRTL = useRTL();

    const prevDisabled = slides.length === 0 || (finite && currentIndex === 0);
    const nextDisabled = slides.length === 0 || (finite && currentIndex === slides.length - 1);

    const throttle = (animation.navigation ?? animation.swipe) / 2;
    const prevThrottled = useThrottle(prev, throttle);
    const nextThrottled = useThrottle(next, throttle);

    const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
        if (event.key === VK_ARROW_LEFT && !(isRTL ? nextDisabled : prevDisabled)) {
            (isRTL ? nextThrottled : prevThrottled)();
        }
        if (event.key === VK_ARROW_RIGHT && !(isRTL ? prevDisabled : nextDisabled)) {
            (isRTL ? prevThrottled : nextThrottled)();
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
                    onClick={prev}
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
                    onClick={next}
                />
            )}
        </>
    );
}

export const NavigationModule = createModule(MODULE_NAVIGATION, Navigation);
