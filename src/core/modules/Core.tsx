import * as React from "react";

import { Component } from "../../types.js";
import { createModule } from "../config.js";
import { EventsProvider, TimeoutsProvider } from "../contexts/index.js";

export const Core: Component = ({ children }) => (
    <TimeoutsProvider>
        <EventsProvider>{children}</EventsProvider>
    </TimeoutsProvider>
);

export const CoreModule = createModule("core", Core);
