import * as React from "react";
import * as ReactDOM from "react-dom";

import { ComponentProps } from "../../types.js";
import { LightboxDefaultProps } from "../../props.js";
import { createModule } from "../config.js";
import { clsx, composePrefix, cssClass, cssVar } from "../utils.js";
import { useEventCallback, useMotionPreference } from "../hooks/index.js";
import { useEvents, useTimeouts } from "../contexts/index.js";
import { ACTION_CLOSE, CLASS_NO_SCROLL_PADDING, MODULE_PORTAL } from "../consts.js";

function cssPrefix(value?: string) {
    return composePrefix(MODULE_PORTAL, value);
}

function setAttribute(element: Element, attribute: string, value: string) {
    const previousValue = element.getAttribute(attribute);

    element.setAttribute(attribute, value);

    return () => {
        if (previousValue) {
            element.setAttribute(attribute, previousValue);
        } else {
            element.removeAttribute(attribute);
        }
    };
}

export function Portal({ children, animation, styles, className, on, close }: ComponentProps) {
    const [mounted, setMounted] = React.useState(false);
    const [visible, setVisible] = React.useState(false);

    const cleanup = React.useRef<(() => void)[]>([]);

    const { setTimeout } = useTimeouts();
    const { subscribe } = useEvents();

    const reduceMotion = useMotionPreference();
    const animationDuration = !reduceMotion ? animation.fade : 0;

    React.useEffect(() => {
        setMounted(true);

        return () => {
            setMounted(false);
            setVisible(false);
        };
    }, []);

    const handleClose = useEventCallback(() => {
        setVisible(false);

        on.exiting?.();

        setTimeout(() => {
            on.exited?.();

            close();
        }, animationDuration);
    });

    React.useEffect(() => subscribe(ACTION_CLOSE, handleClose), [subscribe, handleClose]);

    const handleEnter = useEventCallback((node: HTMLDivElement) => {
        // reflow
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        node.scrollTop;

        setVisible(true);

        on.entering?.();

        const elements = node.parentNode?.children ?? [];
        for (let i = 0; i < elements.length; i += 1) {
            const element = elements[i];
            if (["TEMPLATE", "SCRIPT", "STYLE"].indexOf(element.tagName) === -1 && element !== node) {
                cleanup.current.push(setAttribute(element, "inert", "true"));
                cleanup.current.push(setAttribute(element, "aria-hidden", "true"));
            }
        }

        setTimeout(() => {
            on.entered?.();
        }, animationDuration);
    });

    const handleExit = useEventCallback(() => {
        cleanup.current.forEach((clean) => clean());
        cleanup.current = [];
    });

    const handleRef = React.useCallback(
        (node: HTMLDivElement | null) => {
            if (node) {
                handleEnter(node);
            } else {
                handleExit();
            }
        },
        [handleEnter, handleExit]
    );

    return mounted
        ? ReactDOM.createPortal(
              <div
                  ref={handleRef}
                  className={clsx(
                      className,
                      cssClass("root"),
                      cssClass(cssPrefix()),
                      cssClass(CLASS_NO_SCROLL_PADDING),
                      visible && cssClass(cssPrefix("open"))
                  )}
                  role="presentation"
                  aria-live="polite"
                  style={{
                      ...(animation.fade !== LightboxDefaultProps.animation.fade
                          ? { [cssVar("fade_animation_duration")]: `${animationDuration}ms` }
                          : null),
                      ...(animation.easing.fade !== LightboxDefaultProps.animation.easing.fade
                          ? { [cssVar("fade_animation_timing_function")]: animation.easing.fade }
                          : null),
                      ...styles.root,
                  }}
              >
                  {children}
              </div>,
              document.body
          )
        : null;
}

export const PortalModule = createModule(MODULE_PORTAL, Portal);
