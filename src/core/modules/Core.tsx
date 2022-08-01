import * as React from "react";

import { Component } from "../../types.js";
import { createModule } from "../config.js";
import { EventsProvider, LightboxStateProvider, TimeoutsProvider } from "../contexts/index.js";
import { MODULE_CORE } from "../consts.js";

export const Core: Component = ({ slides, index, children }) => (
    <TimeoutsProvider>
        <EventsProvider>
            <LightboxStateProvider slidesCount={slides.length} initialIndex={index}>
                {children}
            </LightboxStateProvider>
        </EventsProvider>
    </TimeoutsProvider>
);

export const CoreModule = createModule(MODULE_CORE, Core);
