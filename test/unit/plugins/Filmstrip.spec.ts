import * as React from "react";
import { act, render, screen } from "@testing-library/react";

import { clickButton, expectCurrentImageToBe, expectToContainButton, lightbox, querySelector } from "../test-utils.js";
import { Filmstrip, Fullscreen } from "../../../src/plugins/index.js";
import { LightboxExternalProps } from "../../../src/index.js";

function renderLightbox(props?: LightboxExternalProps) {
  return render(
    lightbox({
      slides: [{ src: "image1" }, { src: "image2" }, { src: "image3" }],
      plugins: [Filmstrip],
      ...props,
    }),
  );
}

function queryFilmstripThumbs(withImage = true) {
  return screen
    .queryAllByRole("button")
    .filter((el) => !withImage || Boolean(el.querySelector("img")))
    .filter((el) => el.classList.contains("yarl__filmstrip_thumbnail"));
}

function clickFilmstripThumb(image: string) {
  act(() => {
    const thumb = queryFilmstripThumbs().find((el) => Boolean(el.querySelector(`img[src='${image}']`)));
    if (!thumb) {
      throw new Error(`No filmstrip thumb for ${image}`);
    }
    thumb.click();
  });
}

describe("Filmstrip", () => {
  it("uses native lazy loading on preview images so the browser can defer work", () => {
    renderLightbox();
    clickButton("Next");

    const viewport = querySelector(".yarl__filmstrip_scroll_viewport");
    const images = viewport?.querySelectorAll("img") ?? [];

    expect(images.length).toBeGreaterThan(0);
    Array.from(images).forEach((img) => {
      expect(img.getAttribute("loading")).toBe("lazy");
    });
  });

  it("renders a small window of previews instead of one button per slide", () => {
    const slides = Array.from({ length: 40 }, (_, i) => ({ src: `slide-${i}.jpg` }));
    render(lightbox({ slides, plugins: [Filmstrip] }));
    clickButton("Next");

    const mounted = queryFilmstripThumbs().length;

    expect(slides.length).toBe(40);
    expect(mounted).toBeLessThan(slides.length);
    expect(mounted).toBe(7);
  });

  it("renders without crashing", () => {
    renderLightbox();
    clickButton("Next");
    expect(queryFilmstripThumbs().length).toBeGreaterThan(0);
  });

  it("uses scroll viewport and default cap CSS variable when omitted", () => {
    renderLightbox();
    const viewport = querySelector(".yarl__filmstrip_scroll_viewport");
    expect(viewport).toBeInTheDocument();
    expect(viewport?.getAttribute("style")).toContain("--yarl__filmstrip_scroll_viewport_max");
  });

  it("merges styles.filmstripScrollViewport", () => {
    renderLightbox({
      styles: { filmstripScrollViewport: { outline: "2px solid red" } },
    });
    const viewport = querySelector(".yarl__filmstrip_scroll_viewport") as HTMLElement;
    expect(viewport).toBeInTheDocument();
    expect(viewport.style.outline).toBe("2px solid red");
  });

  it("applies hide-scrollbar class when filmstrip.hideScrollbar is true", () => {
    renderLightbox({ filmstrip: { hideScrollbar: true } });
    clickButton("Next");
    const viewport = querySelector(".yarl__filmstrip_scroll_viewport");
    expect(viewport).toHaveClass("yarl__filmstrip_scroll_viewport_hide_scrollbar");
  });

  it("jumps instantly to another slide without stepping the carousel (goTo)", () => {
    renderLightbox({ carousel: { preload: 0 } });
    expectCurrentImageToBe("image1");
    clickFilmstripThumb("image3");
    expectCurrentImageToBe("image3");
    clickFilmstripThumb("image1");
    expectCurrentImageToBe("image1");
  });

  it("works with Fullscreen when Fullscreen is listed first", () => {
    render(
      lightbox({
        slides: [{ src: "a" }, { src: "b" }],
        plugins: [Fullscreen, Filmstrip],
      }),
    );
    expect(queryFilmstripThumbs().length).toBeGreaterThan(0);
  });

  it("supports filmstrip toggle button", () => {
    renderLightbox({ filmstrip: { showToggle: true } });
    expect(queryFilmstripThumbs().length).toBeGreaterThan(0);

    clickButton("Hide filmstrip");
    const hiddenShell = querySelector(".yarl__filmstrip_container") as HTMLElement | null;
    expect(hiddenShell?.style.display).toBe("none");

    clickButton("Show filmstrip");
    const shownShell = querySelector(".yarl__filmstrip_container") as HTMLElement | null;
    expect(shownShell?.style.display).not.toBe("none");
  });

  it("supports custom filmstrip button", () => {
    renderLightbox({
      filmstrip: { showToggle: true },
      render: { buttonFilmstrip: () => React.createElement("button", { type: "button" }, "Custom filmstrip") },
    });
    expectToContainButton("Custom filmstrip");
  });
});
