import * as React from "react";
import * as ReactDOM from "react-dom";

import { Component } from "../../types.js";
import { LightboxDefaultProps } from "../../props.js";
import { createModule } from "../config.js";
import { clsx, cssClass, cssVar } from "../utils.js";
import { useLatest, useMotionPreference } from "../hooks/index.js";
import { useEvents, useTimeouts } from "../contexts/index.js";

const setAttribute = (element: Element, attribute: string, value: string) => {
    const previousValue = element.getAttribute(attribute);

    element.setAttribute(attribute, value);

    return () => {
        if (previousValue) {
            element.setAttribute(attribute, previousValue);
        } else {
            element.removeAttribute(attribute);
        }
    };
};

export const Portal: Component = ({ children, ...props }) => {
    const [mounted, setMounted] = React.useState(false);
    const [visible, setVisible] = React.useState(false);

    const cleanup = React.useRef<(() => void)[]>([]);

    const latestProps = useLatest(props);
    const latestAnimationDuration = useLatest(!useMotionPreference() ? props.animation.fade : 0);

    const { setTimeout } = useTimeouts();
    const { subscribe } = useEvents();

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    React.useEffect(
        () =>
            subscribe("close", () => {
                setVisible(false);

                latestProps.current.on.exiting?.();

                setTimeout(() => {
                    latestProps.current.on.exited?.();

                    latestProps.current.close();
                }, latestAnimationDuration.current);
            }),
        [setTimeout, subscribe, latestProps, latestAnimationDuration]
    );

    const handlePortalRef = React.useCallback(
        (node: HTMLDivElement | null) => {
            if (node) {
                // reflow
                node.getBoundingClientRect();

                setVisible(true);

                latestProps.current.on.entering?.();

                const elements = node.parentNode?.children ?? [];
                for (let i = 0; i < elements.length; i += 1) {
                    const element = elements[i];
                    if (["TEMPLATE", "SCRIPT", "STYLE"].indexOf(element.tagName) === -1 && element !== node) {
                        cleanup.current.push(setAttribute(element, "inert", "true"));
                        cleanup.current.push(setAttribute(element, "aria-hidden", "true"));
                    }
                }

                setTimeout(() => {
                    latestProps.current.on.entered?.();
                }, latestAnimationDuration.current);
            } else {
                cleanup.current.forEach((clean) => clean());
                cleanup.current = [];
            }
        },
        [setTimeout, latestProps, latestAnimationDuration]
    );

    return mounted
        ? ReactDOM.createPortal(
              <div
                  ref={handlePortalRef}
                  className={clsx(
                      props.className,
                      cssClass("root"),
                      cssClass("portal"),
                      cssClass("no_scroll_padding"),
                      visible && cssClass("portal_open")
                  )}
                  role="presentation"
                  aria-live="polite"
                  style={{
                      ...(props.animation.fade !== LightboxDefaultProps.animation.fade
                          ? {
                                [cssVar("fade_animation_duration")]: `${Math.round(props.animation.fade)}ms`,
                            }
                          : null),
                      ...props.styles.root,
                  }}
              >
                  {children}
              </div>,
              document.body
          )
        : null;
};

export const PortalModule = createModule("portal", Portal);
