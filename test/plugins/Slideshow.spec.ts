import * as React from "react";
import { act, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { expectToContainButton, lightbox, withFakeTimers } from "../utils.js";
import { Slideshow } from "../../src/plugins/index.js";
import { isImageSlide } from "../../src/core/index.js";
import { LightboxExternalProps, SlideshowRef } from "../../src/index.js";

function renderLightbox(props?: LightboxExternalProps) {
    return render(
        lightbox({
            slides: [{ src: "image1" }, { src: "image2" }, { src: "image3" }, { src: "image4" }],
            plugins: [Slideshow],
            ...props,
        })
    );
}

function expectToBePlaying() {
    expect(screen.queryByLabelText("Pause")).toBeInTheDocument();
}

function expectToBePaused() {
    expect(screen.queryByLabelText("Play")).toBeInTheDocument();
}

describe("Slideshow", () => {
    it("provides slideshow play button", () => {
        renderLightbox();

        expectToBePaused();
    });

    it("supports slideshow ref", () => {
        const ref = React.createRef<SlideshowRef>();

        renderLightbox({ slideshow: { ref } });

        expectToBePaused();

        act(() => {
            ref.current!.play();
        });

        expectToBePlaying();

        act(() => {
            ref.current!.pause();
        });

        expectToBePaused();
    });

    it("auto plays slides", () =>
        withFakeTimers(({ runAllTimers }) => {
            const view = vi.fn();
            const slideshowStart = vi.fn();
            const slideshowStop = vi.fn();

            renderLightbox({
                render: {
                    slide: ({ slide }) => (isImageSlide(slide) ? React.createElement("div", null, slide.src) : null),
                },
                on: { view, slideshowStart, slideshowStop },
                carousel: { finite: true },
                slideshow: { autoplay: true },
            });

            for (let i = 0; i < 10; i += 1) {
                runAllTimers();
            }

            expect(view).toHaveBeenCalledTimes(4);
            expect(slideshowStart).toHaveBeenCalledTimes(1);
            expect(slideshowStop).toHaveBeenCalledTimes(1);
        }));

    it("supports custom slideshow button", () => {
        renderLightbox({
            render: { buttonSlideshow: () => React.createElement("button", { type: "button" }, "Custom button") },
        });

        expectToContainButton("Custom button");
    });
});
