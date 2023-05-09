import * as React from "react";
import { act, render, screen } from "@testing-library/react";

import { clickButton, expectCurrentImageToBe, expectToContainButton, lightbox } from "../utils.js";
import { Fullscreen, Thumbnails, Video } from "../../src/plugins/index.js";
import { LightboxExternalProps } from "../../src/index.js";

function renderLightbox(props?: LightboxExternalProps) {
    return render(
        lightbox({
            slides: [{ src: "image1" }, { src: "image2" }, { src: "image3" }],
            plugins: [Thumbnails],
            ...props,
        })
    );
}

function queryThumbnails() {
    return screen
        .queryAllByRole("button")
        .filter((el) => el.className.split(" ").includes("yarl__thumbnails_thumbnail"));
}

function clickThumbnail(image: string) {
    act(() => {
        queryThumbnails()
            .find((el) => Boolean(el.querySelector(`img[src='${image}']`)))!
            .click();
    });
}

function expectThumbnails(visible = true) {
    expect(queryThumbnails().length > 0).toBe(visible);
}

function expectNavigation() {
    clickButton("Next");
    clickButton("Previous");
    expectThumbnails();
}

describe("Thumbnails", () => {
    it("renders without crashing", () => {
        renderLightbox();
        expectNavigation();
    });

    it("supports thumbnails toggle button", () => {
        renderLightbox({ thumbnails: { showToggle: true } });
        expectThumbnails();

        clickButton("Hide thumbnails");
        expectThumbnails(false);

        clickButton("Show thumbnails");
        expectThumbnails();
    });

    it("supports thumbnails navigation", () => {
        renderLightbox({ carousel: { preload: 1 } });
        expectCurrentImageToBe("image1");

        clickThumbnail("image2");
        expectCurrentImageToBe("image2");

        clickThumbnail("image1");
        expectCurrentImageToBe("image1");
    });

    it("supports thumbnails position", () => {
        renderLightbox({ thumbnails: { position: "top" } });
        expectNavigation();

        renderLightbox({ thumbnails: { position: "bottom" } });
        expectNavigation();

        renderLightbox({ thumbnails: { position: "start" } });
        expectNavigation();

        renderLightbox({ thumbnails: { position: "end" } });
        expectNavigation();
    });

    it("works with Fullscreen", () => {
        // Fullscreen plugin must be listed first
        renderLightbox({ plugins: [Fullscreen, Thumbnails] });
        expectThumbnails();
    });

    it("supports custom thumbnails button", () => {
        renderLightbox({
            thumbnails: { showToggle: true },
            render: { buttonThumbnails: () => React.createElement("button", { type: "button" }, "Custom button") },
        });
        expectToContainButton("Custom button");
    });

    it("supports thumbnails customization", () => {
        renderLightbox({ thumbnails: { border: 2, borderRadius: 5, width: 60, height: 40, padding: 10, gap: 10 } });
        expectThumbnails();
    });

    it("supports finite carousel", () => {
        renderLightbox({ carousel: { finite: true } });
        expectThumbnails();

        clickButton("Next");
        expectThumbnails();
    });

    it("supports video thumbnails", () => {
        renderLightbox({
            slides: [{ type: "video", poster: "poster", sources: [{ src: "video", type: "video/mp4" }] }],
            plugins: [Thumbnails, Video],
        });
        clickThumbnail("poster");
    });

    it("supports unknown slide types", () => {
        // @ts-expect-error
        renderLightbox({ slides: [{ type: "custom" }] });
        expectThumbnails();
    });

    it("supports custom thumbnails", () => {
        renderLightbox({ render: { thumbnail: () => React.createElement("img", { src: "custom" }) } });
        clickThumbnail("custom");
    });
});
