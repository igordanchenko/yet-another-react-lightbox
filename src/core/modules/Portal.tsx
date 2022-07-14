import * as React from "react";
import * as ReactDOM from "react-dom";

import { Component, LightboxDefaultProps } from "../../types.js";
import { createModule } from "../config.js";
import { clsx, cssClass, cssVar } from "../utils.js";
import { useLatest, useMotionPreference } from "../hooks/index.js";
import { useEvents, useTimeouts } from "../contexts/index.js";

export const Portal: Component = ({ children, ...props }) => {
    const [mounted, setMounted] = React.useState(false);
    const [visible, setVisible] = React.useState(false);

    const latestProps = useLatest(props);
    const latestAnimationDuration = useLatest(!useMotionPreference() ? props.animation.fade : 0);

    const { setTimeout } = useTimeouts();
    const { subscribe } = useEvents();

    React.useEffect(() => {
        setMounted(true);

        return () => {
            setMounted(false);
        };
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

                setTimeout(() => {
                    latestProps.current.on.entered?.();
                }, latestAnimationDuration.current);
            }
        },
        [setTimeout, latestProps, latestAnimationDuration]
    );

    return mounted
        ? ReactDOM.createPortal(
              <div
                  ref={handlePortalRef}
                  className={clsx(
                      cssClass("portal"),
                      cssClass("no_scroll_padding"),
                      visible && cssClass("portal_open")
                  )}
                  role="presentation"
                  aria-live="polite"
                  {...(props.animation.fade !== LightboxDefaultProps.animation.fade
                      ? {
                            style: {
                                [cssVar("fade_animation_duration")]: `${Math.round(props.animation.fade)}ms`,
                            },
                        }
                      : null)}
              >
                  {children}
              </div>,
              document.body
          )
        : null;
};

export const PortalModule = createModule("portal", Portal);
