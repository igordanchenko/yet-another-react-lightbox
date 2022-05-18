import * as React from "react";

import { Component } from "../../types.js";
import { createModule } from "../config.js";
import { cssClass, cssVar } from "../utils.js";

const noScroll = cssClass("no_scroll");
const padScrollbar = cssClass("pad_scrollbar");
const scrollbarPadding = cssVar("scrollbar_padding");

export const NoScroll: Component = ({ children }) => {
    React.useEffect(() => {
        const scrollbarWidth = Math.round(window.innerWidth - document.documentElement.clientWidth);

        // using an arbitrary threshold to counter the 1px difference in some browsers
        if (scrollbarWidth > 1) {
            document.body.style.setProperty(scrollbarPadding, `${scrollbarWidth}px`);
            document.body.classList.add(padScrollbar);
        }
        document.body.classList.add(noScroll);

        return () => {
            document.body.style.removeProperty(scrollbarPadding);
            document.body.classList.remove(noScroll, padScrollbar);
        };
    });

    return <>{children}</>;
};

export const NoScrollModule = createModule("no-scroll", NoScroll);
