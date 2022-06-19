import * as React from "react";

import { Labels } from "../types.js";

export const clsx = (...classes: (string | boolean | undefined)[]) =>
    [...classes].filter((cls) => Boolean(cls)).join(" ");

const cssPrefix = "yarl__";

export const cssClass = (name: string) => `${cssPrefix}${name}`;

export const cssVar = (name: string) => `--${cssPrefix}${name}`;

export const label = (labels: Labels | undefined, lbl: string) => (labels && labels[lbl] ? labels[lbl] : lbl);

export const cleanup =
    (...cleaners: (() => void)[]) =>
    () => {
        cleaners.forEach((cleaner) => {
            cleaner();
        });
    };

export const makeUseContext =
    <T>(name: string, contextName: string, context: React.Context<T | null>) =>
    () => {
        const ctx = React.useContext(context);
        if (!ctx) {
            throw new Error(`${name} must be used within a ${contextName}.Provider`);
        }
        return ctx;
    };

export const hasWindow = () => typeof window !== "undefined";

export const adjustDevicePixelRatio = (value: number) =>
    hasWindow() ? Math.round(value / (window.devicePixelRatio || 1)) : value;

export const isRTL = (node: HTMLElement) => window.getComputedStyle(node).direction === "rtl";
