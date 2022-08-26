import * as React from "react";
import { render, screen } from "@testing-library/react";

import { lightbox, runAllTimers } from "../utils.js";
import { Slideshow } from "../../src/plugins/index.js";
import { isImageSlide } from "../../src/core/index.js";

describe("Inline", () => {
    it("provides slideshow play button", () => {
        render(lightbox({ plugins: [Slideshow] }));

        expect(screen.queryByLabelText("Play")).toBeInTheDocument();
    });

    it("auto plays slides", () => {
        jest.useFakeTimers();

        const onView = jest.fn();

        render(
            lightbox({
                slides: [{ src: "image1" }, { src: "image2" }, { src: "image3" }, { src: "image4" }],
                render: {
                    slide: (slide) => (isImageSlide(slide) ? React.createElement("div", null, slide.src) : null),
                },
                on: { view: onView },
                carousel: { finite: true },
                slideshow: { autoplay: true },
                plugins: [Slideshow],
            })
        );

        for (let i = 0; i < 10; i += 1) {
            runAllTimers();
        }

        expect(onView).toHaveBeenCalledTimes(4);

        jest.useRealTimers();
    });
});
