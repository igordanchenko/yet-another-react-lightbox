import * as React from "react";

import { ComponentProps } from "../../types.js";
import { createModule } from "../config.js";
import { EventsProvider, LightboxStateProvider, TimeoutsProvider } from "../contexts/index.js";
import { MODULE_CORE } from "../consts.js";

export function Core({ slides, index, children }: ComponentProps) {
    return (
        <TimeoutsProvider>
            <EventsProvider>
                <LightboxStateProvider slidesCount={slides.length} initialIndex={index}>
                    {children}
                </LightboxStateProvider>
            </EventsProvider>
        </TimeoutsProvider>
    );
}

export const CoreModule = createModule(MODULE_CORE, Core);
