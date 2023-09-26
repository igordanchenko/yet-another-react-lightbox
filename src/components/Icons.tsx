import * as React from "react";

function svgIcon(name: string, children: React.ReactNode) {
    const icon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            aria-hidden="true"
            focusable="false"
            {...props}
        >
            {children}
        </svg>
    );
    icon.displayName = name;
    return icon;
}

export function createIcon(name: string, glyph: React.ReactNode) {
    return svgIcon(
        name,
        <g fill="currentColor">
            <path d="M0 0h24v24H0z" fill="none" />
            {glyph}
        </g>
    );
}

export function createIconDisabled(name: string, glyph: React.ReactNode) {
    return svgIcon(
        name,
        <>
            <defs>
                <mask id="strike">
                    <path d="M0 0h24v24H0z" fill="white" />
                    <path d="M0 0L24 24" stroke="black" strokeWidth={4} />
                </mask>
            </defs>
            <path d="M0.70707 2.121320L21.878680 23.292883" stroke="currentColor" strokeWidth={2} />
            <g fill="currentColor" mask="url(#strike)">
                <path d="M0 0h24v24H0z" fill="none" />
                {glyph}
            </g>
        </>
    );
}

export const CloseIcon = createIcon(
    "Close",
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
);

export function PreviousIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24" fill="none" {...props}>
            <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" fill="white" />
            <g clipPath="url(#clip0_5180_64953)">
                <g clipPath="url(#clip1_5180_64953)">
                    <path
                        d="M26 18L20 24L26 30"
                        stroke="black"
                        strokeWidth="1.75"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                    />
                </g>
            </g>
            <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" stroke="#ACB0B4" />
            <defs>
                <clipPath id="clip0_5180_64953">
                    <rect width="24" height="24" fill="white" transform="translate(12 12)" />
                </clipPath>
                <clipPath id="clip1_5180_64953">
                    <rect width="24" height="24" fill="white" transform="translate(12 12)" />
                </clipPath>
            </defs>
        </svg>
    );
}

export function NextIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24" fill="none" {...props}>
            <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" fill="white" />
            <g clipPath="url(#clip0_5180_64958)">
                <g clipPath="url(#clip1_5180_64958)">
                    <path
                        d="M22 30L28 24L22 18"
                        stroke="black"
                        strokeWidth="1.75"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                    />
                </g>
            </g>
            <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" stroke="#ACB0B4" />
            <defs>
                <clipPath id="clip0_5180_64958">
                    <rect width="24" height="24" fill="white" transform="translate(12 12)" />
                </clipPath>
                <clipPath id="clip1_5180_64958">
                    <rect width="24" height="24" fill="white" transform="translate(12 12)" />
                </clipPath>
            </defs>
        </svg>
    );
}

export const LoadingIcon = createIcon(
    "Loading",
    <>
        {Array.from({ length: 8 }).map((_, index, array) => (
            <line
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                x1="12"
                y1="6.5"
                x2="12"
                y2="1.8"
                strokeLinecap="round"
                strokeWidth="2.6"
                stroke="currentColor"
                strokeOpacity={(1 / array.length) * (index + 1)}
                transform={`rotate(${(360 / array.length) * index}, 12, 12)`}
            />
        ))}
    </>
);

export const ErrorIcon = createIcon(
    "Error",
    <path d="M21.9,21.9l-8.49-8.49l0,0L3.59,3.59l0,0L2.1,2.1L0.69,3.51L3,5.83V19c0,1.1,0.9,2,2,2h13.17l2.31,2.31L21.9,21.9z M5,18 l3.5-4.5l2.5,3.01L12.17,15l3,3H5z M21,18.17L5.83,3H19c1.1,0,2,0.9,2,2V18.17z" />
);
