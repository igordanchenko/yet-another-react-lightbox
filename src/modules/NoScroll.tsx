import * as React from "react";

import { ComponentProps } from "../types.js";
import { createModule } from "../config.js";
import { cssClass } from "../utils.js";
import { useLayoutEffect, useRTL } from "../hooks/index.js";
import { CLASS_NO_SCROLL, CLASS_NO_SCROLL_PADDING, MODULE_NO_SCROLL } from "../consts.js";

const noScroll = cssClass(CLASS_NO_SCROLL);
const noScrollPadding = cssClass(CLASS_NO_SCROLL_PADDING);

function isHTMLElement(element: Element): element is HTMLElement {
    return "style" in element;
}

function padScrollbar(element: HTMLElement, padding: number, rtl: boolean) {
    const styles = window.getComputedStyle(element);
    const property = rtl ? "padding-left" : "padding-right";
    const computedValue = rtl ? styles.paddingLeft : styles.paddingRight;
    const originalValue = element.style.getPropertyValue(property);

    element.style.setProperty(property, `${(parseInt(computedValue, 10) || 0) + padding}px`);

    return () => {
        if (originalValue) {
            element.style.setProperty(property, originalValue);
        } else {
            element.style.removeProperty(property);
        }
    };
}

export function NoScroll({ noScroll: { disabled }, children }: ComponentProps) {
    const rtl = useRTL();

    useLayoutEffect(() => {
        if (disabled) return () => {};

        const cleanup: (() => void)[] = [];

        const { body, documentElement } = document;

        const scrollbar = Math.round(window.innerWidth - documentElement.clientWidth);
        if (scrollbar > 0) {
            cleanup.push(padScrollbar(body, scrollbar, rtl));

            const elements = body.getElementsByTagName("*");
            for (let i = 0; i < elements.length; i += 1) {
                const element = elements[i];
                if (
                    isHTMLElement(element) &&
                    window.getComputedStyle(element).getPropertyValue("position") === "fixed" &&
                    !element.classList.contains(noScrollPadding)
                ) {
                    cleanup.push(padScrollbar(element, scrollbar, rtl));
                }
            }
        }

        body.classList.add(noScroll);

        return () => {
            body.classList.remove(noScroll);

            cleanup.forEach((clean) => clean());
        };
    }, [rtl, disabled]);

    return <>{children}</>;
}

export const NoScrollModule = createModule(MODULE_NO_SCROLL, NoScroll);
