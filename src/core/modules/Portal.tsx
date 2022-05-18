import * as React from "react";
import * as ReactDOM from "react-dom";

import { Component, LightboxDefaultProps } from "../../types.js";
import { createModule } from "../config.js";
import { cssClass, cssVar } from "../utils.js";
import { useEvents } from "../contexts/index.js";

export const Portal: Component = ({ animation, children }) => {
    const [mounted, setMounted] = React.useState(false);

    const [portal] = React.useState(() => {
        const div = document.createElement("div");
        div.className = cssClass("portal");
        if (animation.fade !== LightboxDefaultProps.animation.fade) {
            div.style.setProperty(cssVar("fade_animation_duration"), `${Math.round(animation.fade)}ms`);
        }
        return div;
    });

    const { subscribe } = useEvents();

    React.useEffect(
        () =>
            subscribe("close", () => {
                portal.classList.remove(cssClass("portal_open"));
            }),
        [subscribe, portal]
    );

    React.useEffect(() => {
        document.body.appendChild(portal);
        setMounted(true);

        setTimeout(() => {
            portal.classList.add(cssClass("portal_open"));
        }, 0);

        return () => {
            document.body.removeChild(portal);
            setMounted(false);
        };
    }, [portal]);

    return ReactDOM.createPortal(mounted ? children : null, portal);
};

export const PortalModule = createModule("portal", Portal);
