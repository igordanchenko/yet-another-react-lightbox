import * as React from "react";
import { screen } from "@testing-library/react";

import { Lightbox } from "../src/index.js";

export const lightbox = (props?: Parameters<typeof Lightbox>[0]) => <Lightbox open {...props} />;

export const querySelectorAll = (selector: string) => screen.getByRole("presentation").querySelectorAll(selector);

export const findCurrentSlide = () =>
    Array.from(querySelectorAll("div.yarl__slide")).find((el) =>
        el.getAttribute("style")?.includes("--yarl__slide_offset: 0")
    );

export const findCurrentImage = () => findCurrentSlide()?.querySelector("img")?.src;
