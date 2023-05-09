import * as React from "react";

import {
    clsx,
    ComponentProps,
    createModule,
    cssClass,
    MODULE_CONTROLLER,
    PLUGIN_COUNTER,
    PluginProps,
    useLightboxState,
} from "../../index.js";

export function CounterComponent({ counter: { className, ...rest } = {} }: ComponentProps) {
    const { slides, currentIndex } = useLightboxState();

    if (slides.length === 0) return null;

    return (
        <div className={clsx(cssClass("counter"), className)} {...rest}>
            {currentIndex + 1} / {slides.length}
        </div>
    );
}

/** Counter plugin */
export function Counter({ addChild }: PluginProps) {
    addChild(MODULE_CONTROLLER, createModule(PLUGIN_COUNTER, CounterComponent));
}
