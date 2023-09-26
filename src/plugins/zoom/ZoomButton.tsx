import * as React from "react";

import { IconButton, useLightboxProps } from "../../index.js";
import { useZoom } from "./ZoomController.js";

export function ZoomInIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24" fill="none" {...props}>
            <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" fill="white" />
            <g clipPath="url(#clip0_5180_64943)">
                <path
                    d="M24 17V31"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M17 24H31"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" stroke="currentColor" />
            <defs>
                <clipPath id="clip0_5180_64943">
                    <rect width="24" height="24" fill="white" transform="translate(12 12)" />
                </clipPath>
            </defs>
        </svg>
    );
}

export function ZoomOutIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24" fill="none" {...props}>
            <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" fill="white" />
            <g clipPath="url(#clip0_5180_64948)">
                <path
                    d="M17 24H31"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" stroke="currentColor" />
            <defs>
                <clipPath id="clip0_5180_64948">
                    <rect width="24" height="24" fill="white" transform="translate(12 12)" />
                </clipPath>
            </defs>
        </svg>
    );
}

/** Zoom button props */
export type ZoomButtonProps = {
    zoomIn?: boolean;
    onLoseFocus: () => void;
};

/** Zoom button */
export const ZoomButton = React.forwardRef<HTMLButtonElement, ZoomButtonProps>(function ZoomButton(
    { zoomIn, onLoseFocus },
    ref
) {
    const wasEnabled = React.useRef(false);
    const wasFocused = React.useRef(false);

    const { zoom, maxZoom, zoomIn: zoomInCallback, zoomOut: zoomOutCallback, disabled: zoomDisabled } = useZoom();
    const { render } = useLightboxProps();

    const disabled = zoomDisabled || (zoomIn ? zoom >= maxZoom : zoom <= 1);

    React.useEffect(() => {
        if (disabled && wasEnabled.current && wasFocused.current) {
            onLoseFocus();
        }
        if (!disabled) {
            wasEnabled.current = true;
        }
    }, [disabled, onLoseFocus]);

    return (
        <IconButton
            ref={ref}
            disabled={disabled}
            label={zoomIn ? "Zoom in" : "Zoom out"}
            icon={zoomIn ? ZoomInIcon : ZoomOutIcon}
            renderIcon={zoomIn ? render.iconZoomIn : render.iconZoomOut}
            onClick={zoomIn ? zoomInCallback : zoomOutCallback}
            onFocus={() => {
                wasFocused.current = true;
            }}
            onBlur={() => {
                wasFocused.current = false;
            }}
        />
    );
});
