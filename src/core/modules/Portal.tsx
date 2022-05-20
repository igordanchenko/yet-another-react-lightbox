import * as React from "react";
import * as ReactDOM from "react-dom";

import { Component, LightboxDefaultProps } from "../../types.js";
import { createModule } from "../config.js";
import { cssClass, cssVar } from "../utils.js";
import { useLatest } from "../hooks/useLatest.js";
import { useEvents, useTimeouts } from "../contexts/index.js";

export const Portal: Component = ({ children, ...props }) => {
    const [mounted, setMounted] = React.useState(false);

    const latestProps = useLatest(props);

    const { setTimeout } = useTimeouts();
    const { subscribe } = useEvents();

    const [portal] = React.useState(() => {
        const div = document.createElement("div");
        div.className = cssClass("portal");

        const fadeAnimation = latestProps.current.animation.fade;
        if (fadeAnimation !== LightboxDefaultProps.animation.fade) {
            div.style.setProperty(cssVar("fade_animation_duration"), `${Math.round(fadeAnimation)}ms`);
        }

        return div;
    });

    React.useEffect(
        () =>
            subscribe("close", () => {
                latestProps.current.on.exiting?.();

                portal.classList.remove(cssClass("portal_open"));

                setTimeout(() => {
                    latestProps.current.on.exited?.();

                    latestProps.current.close();
                }, latestProps.current.animation.fade);
            }),
        [portal, setTimeout, subscribe, latestProps]
    );

    React.useEffect(() => {
        document.body.appendChild(portal);
        setMounted(true);

        latestProps.current.on.entering?.();

        setTimeout(() => {
            portal.classList.add(cssClass("portal_open"));
        }, 0);

        setTimeout(() => {
            latestProps.current.on.entered?.();
        }, latestProps.current.animation.fade);

        return () => {
            document.body.removeChild(portal);
            setMounted(false);
        };
    }, [portal, setTimeout, latestProps]);

    return ReactDOM.createPortal(mounted ? children : null, portal);
};

export const PortalModule = createModule("portal", Portal);
