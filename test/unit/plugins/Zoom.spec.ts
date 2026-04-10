import * as React from "react";
import { act, render, screen } from "@testing-library/react";

import { expectLightboxToBeOpen, findCurrentSlide, lightbox } from "../test-utils.js";
import { Zoom } from "../../../src/plugins/index.js";
import type { GenericSlide, Slide } from "../../../src/types.js";

declare module "../../../src/types.js" {
  interface SlideTypes {
    "custom-slide": CustomSlide;
  }
}

interface CustomSlide extends GenericSlide {
  type: "custom-slide";
}

function customSlideRenderer({ slide }: { slide: Slide }) {
  if (slide.type === "custom-slide") {
    return React.createElement("div", { "data-testid": "custom-slide" });
  }
  return undefined;
}

describe("Zoom", () => {
  it("renders without crashing", async () => {
    render(
      lightbox({
        slides: Array.from({ length: 3 }).map((_, i) => ({
          src: `image${i + 1}`,
          width: 3000,
          height: 2000,
        })),
        plugins: [Zoom],
      }),
    );

    act(() => {
      screen.getByLabelText("Zoom in").click();
    });

    act(() => {
      screen.getByLabelText("Zoom out").click();
    });

    expectLightboxToBeOpen();
  });

  it("supports custom slide types", () => {
    render(
      lightbox({
        slides: [{ type: "custom-slide" }],
        plugins: [Zoom],
        zoom: { supports: ["custom-slide"] },
        render: { slide: customSlideRenderer },
      }),
    );

    const customSlide = findCurrentSlide()?.querySelector("[data-testid='custom-slide']");
    expect(customSlide).toBeInTheDocument();
    expect(customSlide?.closest(".yarl__slide_wrapper")).toBeInTheDocument();
  });

  it("does not wrap unsupported custom slide types", () => {
    render(
      lightbox({
        slides: [{ type: "custom-slide" }],
        plugins: [Zoom],
        render: { slide: customSlideRenderer },
      }),
    );

    const customSlide = findCurrentSlide()?.querySelector("[data-testid='custom-slide']");
    expect(customSlide).toBeInTheDocument();
    expect(customSlide?.closest(".yarl__slide_wrapper")).toBeNull();
  });

  it("supports maxZoom as a function", () => {
    render(
      lightbox({
        slides: [{ type: "custom-slide" }],
        plugins: [Zoom],
        zoom: {
          supports: ["custom-slide"],
          maxZoom: (slide: Slide) => (slide.type === "custom-slide" ? 5 : undefined),
        },
        render: { slide: customSlideRenderer },
      }),
    );

    const customSlide = findCurrentSlide()?.querySelector("[data-testid='custom-slide']");
    expect(customSlide).toBeInTheDocument();
    expect(customSlide?.closest(".yarl__slide_wrapper")).toBeInTheDocument();
  });
});
